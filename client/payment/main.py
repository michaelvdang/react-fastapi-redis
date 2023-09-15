from fastapi import FastAPI, Request, Body
from fastapi.background import BackgroundTasks
from redis_om import get_redis_connection, HashModel
from redis_om.model.model import NotFoundError
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import time

load_dotenv()
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  allow_methods = ['*'],
  allow_headers = ['*'],
)

redis = get_redis_connection(
  host = 'redis-17801.c53.west-us.azure.cloud.redislabs.com',
  port = 17801,
  password = REDIS_PASSWORD,
  decode_responses = True,
)

class Order(HashModel):
  product_id: str
  price: float
  fee: float 
  total: float
  quantity: int
  status: str # pending, completed, refunded

  class Meta:
    database = redis

@app.get("/")
def payment_service():
  return "Payment Service"

@app.get('/orders')
def all():
  return [format(pk) for pk in Order.all_pks() ]

def format(pk: str):
  order = Order.get(pk)

  return {
    'pk': order.pk,
    'product_id': order.product_id,
    'price': order.price,
    'fee': order.fee,
    'total': order.total,
    'quantity': order.quantity,
    'status': order.status,
  }

@app.post('/orders')
async def create(request: Request, background_tasks: BackgroundTasks): # id, quantity
  body = (await request.json())
  response = requests.get('http://localhost:8000/products/' + body['product_id'])
  product = response.json()

  order = Order(
    product_id = product['pk'],
    price = product['price'],
    fee = 0.2 * product['price'],
    total = 1.2 * product['price'],
    quantity = body['quantity'],
    status = 'pending',
  )
  order.save()
  background_tasks.add_task(order_completed, order)
  # order_completed(order)
  return order

def order_completed(order: Order):
  time.sleep(5) # processing payment, if successful, then:
  order.status = 'completed'
  order.save()
  # RedisStream, similar to Kafka, RabbitMQ
  # this will be consumed by the product service
  redis.xadd('order_completed', dict(order), '*')


@app.get('/orders/{pk}')
def get(pk: str):
  try:
    return Order.get(pk)
  except NotFoundError:
    return 'Order not found'

@app.delete('/orders/{pk}')
def delete(pk: str):
  try:
    return Order.delete(pk)
  except NotFoundError:
    return 'Order not found'

@app.delete('/orders')
def delete(lis: list[str]):
  # return lis
  return [Order.delete(pk) for pk in lis]

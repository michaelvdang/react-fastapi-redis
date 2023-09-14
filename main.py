from fastapi import FastAPI
from redis_om import get_redis_connection, HashModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ['http://localhost:3000'],
  allow_methods = ['*'],
  allow_headers = ['*'],
)

# redis = redis.Redis(
redis = get_redis_connection(
  host = 'redis-17801.c53.west-us.azure.cloud.redislabs.com',
  port = 17801,
  password = REDIS_PASSWORD,
  decode_responses = True,
)

class Product(HashModel):
  name:str
  price: float
  quantity: int

  class Meta:
    database = redis

@app.get("/products")
def all():
  # product = Product(
  #   name = 'Product 1',
  #   price = 10.99,
  #   quantity = 10,
  # )
  # print(product.save())
  return [format(pk) for pk in Product.all_pks() ]

def format(pk: str):
  product = Product.get(pk)

  return {
    'id': product.pk,
    'name': product.name,
    'price': product.price,
    'quantity': product.quantity,
  }

@app.get('/products/{pk}')
def get(pk: str):
  return Product.get(pk)

@app.post('/products')
async def create(product: Product):
  print(str(product))
  return (product.save())

@app.delete('/products/{pk}')
def delete(pk: str):
  return Product.delete(pk)
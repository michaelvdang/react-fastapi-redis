from main import redis, Product
import time

key = 'order_completed'
group = 'inventory-group'

try:
  redis.xgroup_create(key, group, mkstream=True) # mkstream will create the stream if it doesn't exist
except:
  print('Group already exists')

while True:
  try:
    results = redis.xreadgroup(group, key, {key: '>'}, None)

    print(results)

    if results != []:
      for result in results: 
        obj = result[1][0][1]
        try:
          product = Product.get(obj['product_id'])
          
          print('Product inventory before:', product)
          ## check if product inventory is enough
          product.quantity -= int(obj['quantity'])
          product.save()
          product = Product.get(obj['product_id'])
          print('Product inventory after:', product)
        except Exception as e:
          print(str(e))
          redis.xadd('refund_order', obj, '*')
        
        
  except Exception as e:
    print(str(e))

  time.sleep(1)
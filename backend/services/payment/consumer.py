from main import redis, Order
import time

key = 'refund_order'
group = 'payment-group'

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
        order = Order.get(obj['pk'])
        ## refund logic
        order.status = 'refunded'
        order.save()
        print('Order refunded:', order)
        
        
  except Exception as e:
    print(str(e))

  time.sleep(1)
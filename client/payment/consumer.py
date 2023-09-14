from main import redis, Product

key = 'order_completed'
group = 'inventory-group'

try:
  redis.xgroup_create(key, group, mkstream=True)
except:
  print('Group already exists')
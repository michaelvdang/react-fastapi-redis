import redis
import os
from dotenv import load_dotenv

load_dotenv()
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)
r = redis.Redis(
  host = 'redis-17801.c53.west-us.azure.cloud.redislabs.com',
  port = 17801,
  password = 'YgodGB3VVhT9YCzuapSS7aKEXvKY4Pdr',
  decode_responses = True,
  # ssl=True,
  # ssl_certfile="./redis_user.crt",
  # ssl_keyfile="./redis_user_private.key",
  # ssl_ca_certs="./redis_ca.pem",
)

print(r.set('foo', 'bar'))
print(r.get('foo'))
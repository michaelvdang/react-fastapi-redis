Demo of microservices APIs using Redis cache and RedisStreams for messaging

There are 2 backend microservices:
- Inventory:
  - Run: uvicorn main:app --reload
- Payment:
  - Run: uvicorn main:app --reload

Also 2 frontends that communicates with the APIs
There are 2 frontends:
- Inventory (./inventory-frontend):
  - Run: npm install
  - Then: npm start
- Order (./payment-frontendcra):
  - Run: npm install
  - Then: npm start

  
https://www.youtube.com/watch?v=Cy9fAvsXGZA
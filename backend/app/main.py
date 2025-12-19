from fastapi import FastAPI

app = FastAPI(title="Telemed Web")

@app.get("/")
async def read_root():
    return {"message": "Hello World"}



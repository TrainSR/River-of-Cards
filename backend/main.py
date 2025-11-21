#backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI()

cardpacks = ["ABC", "HEllp"]
# Cho phép React frontend truy cập backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-string")
def get_string():
    return cardpacks

# cd backend
# uvicorn main:app --reload
# version 3.10


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", reload=True)  # cho phép truy cập từ mọi nơi



print("ENVIRONMENT VARIABLES:")
for k, v in os.environ.items():
    print(k, "=", v)

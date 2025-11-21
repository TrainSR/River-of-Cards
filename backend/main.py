#backend
from threading import settrace

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from core.config import settings

app = FastAPI(
    title="Backend",
    version="1.0",
)

cardpacks = ["ABC", "HEllp"]
# Cho phép React frontend truy cập backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGIN],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-string")
def get_string():
    return settings.DECK_FILE_ID

# cd backend
# uvicorn main:app --reload
# version 3.10


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5173, reload=True)  # cho phép truy cập từ mọi nơi



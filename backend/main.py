#backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import drive_module.drive_ops as drive_ops
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI()

cardpacks_id = "1u55lbW95eXte44VQLOrNFEXCkdWYTGBr"
file_content = drive_ops.get_file_content(cardpacks_id)
cardpacks = drive_ops.extract_yaml(file_content)["System_CardPacks"]
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

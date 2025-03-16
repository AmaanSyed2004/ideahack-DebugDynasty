from fastapi import FastAPI, File, UploadFile, Form
from typing import Annotated
import numpy as np
import json
from face_recognition import get_face_embedding, compare_face_and_embedding
app = FastAPI()

@app.post("/get_face_embedding")
async def upload_image(image: Annotated[UploadFile, File(...)]):
    try:
        image_bytes = await image.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)

        # Get face embedding
        result = get_face_embedding(np_arr)

        return result

    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

@app.post("/verify_face")
async def compare_faces(image: Annotated[UploadFile, File(...)], embedding: Annotated[str, Form(...)]):
    try:
        image_bytes = await image.read()
        image_array = np.frombuffer(image_bytes, np.uint8)
        embedding_array = json.loads(embedding)
        
        result= compare_face_and_embedding(embedding=embedding_array, image_array=image_array)
        
        return result
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

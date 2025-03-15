from fastapi import FastAPI, File, UploadFile
from typing import Annotated
import numpy as np
from face_recognition import get_face_embedding
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
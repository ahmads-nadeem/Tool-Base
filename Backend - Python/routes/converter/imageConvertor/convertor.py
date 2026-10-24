from fastapi import APIRouter, FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
from PIL import Image
import io
import zipfile

router = APIRouter()

# Optional: Agar AVIF / HEIF support chahiye ho toh pillow-heif install karke unregister/register karein
# import pillow_heif
# pillow_heif.register_heif_opener()


async def mutlipleImages(
    file: List[UploadFile], format_mapping: dict, target_format: str
):
    all_buffers = []
    for img in file:
        # Read image bytes
        image_bytes = await img.read()

        # Stream ko variable me store karein taake garbage collection se bache
        image_stream = io.BytesIO(image_bytes)
        image = Image.open(image_stream)

        # Image data ko memory me fully load karne ke liye zaroori hai
        image.load()

        pil_format = format_mapping.get(target_format, target_format.upper())
        if pil_format.upper() == "JPG":
            pil_format = "JPEG"

        # Handle transparency (RGBA -> RGB) for formats like JPEG/BMP
        if pil_format in ["JPEG", "BMP"] and image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Save converted image to memory buffer
        output_buffer = io.BytesIO()

        # Quality sirf JPEG aur WEBP ke liye pass karein (baaki formats quality support nahi karte)
        if pil_format in ["JPEG", "WEBP"]:
            image.save(output_buffer, format=pil_format, quality=90)
        else:
            image.save(output_buffer, format=pil_format)

        output_buffer.seek(0)
        all_buffers.append(output_buffer)

    return all_buffers


def zipping(all_buffers, target_format):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for index, img_buffer in enumerate(all_buffers):
            file_name = f"converted_{index + 1}.{target_format}"
            zip_file.writestr(file_name, img_buffer.getvalue())

    # Buffer seek ko alag line par call karein taake integer return na ho
    zip_buffer.seek(0)
    return zip_buffer


@router.post("/convert")
async def convert_image(
    file: List[UploadFile] = File(...),
    target_format: str = Form(...),  # Format e.g., "webp", "png", "jpeg", "avif"
):
    target_format = target_format.lower().strip()

    format_mapping = {
        "jpg": "JPEG",
        "jpeg": "JPEG",
        "png": "PNG",
        "webp": "WEBP",
        "avif": "AVIF",
        "bmp": "BMP",
        "tiff": "TIFF",
    }

    if target_format not in format_mapping:
        raise HTTPException(status_code=400, detail="Unsupported format requested.")

    try:
        # Agar aik se zyada files ek sath aati hain toh ZIP return karega
        if len(file) > 1:
            images = await mutlipleImages(file, format_mapping, target_format)
            output = zipping(images, target_format)
            media_type = "application/zip"
            return StreamingResponse(
                output,
                media_type=media_type,
                headers={"Content-Disposition": 'attachment; filename="Images.zip"'},
            )

        # Agar sirf AIK file hai (frontend ke concurrent setup ke mutabiq)
        else:
            img = file[0]
            if img.filename is None:
                raise HTTPException(status_code=400, detail="Invalid filename!")

            images = await mutlipleImages([img], format_mapping, target_format)
            output_buffer = images[0]

            # Content type determination
            media_type = (
                f"image/{'jpeg' if target_format in ['jpg', 'jpeg'] else target_format}"
            )

            # Original name ke sath new extension lagana
            original_name = img.filename.rsplit(".", 1)[0]
            download_filename = f"{original_name}.{target_format}"

            return StreamingResponse(
                output_buffer,
                media_type=media_type,
                headers={
                    "Content-Disposition": f'attachment; filename="{download_filename}"'
                },
            )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Image conversion failed: {str(e)}"
        )

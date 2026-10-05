from slugify import slugify
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
router = APIRouter()
class slug_req(BaseModel):
    slug_field: str
    @field_validator('slug_field')
    def is_empty(cls, value: str)->str:
        if not value.strip():
            raise ValueError("Input text or URL cannot be empty")
        return value
class slug_res(BaseModel):
    original: str
    slug: str
@router.post('/url-slug', response_model=slug_res)    
def slug(payload: slug_req):
    url_input = payload.slug_field
    slug = slugify(url_input)
    if not slug:
        raise HTTPException(status_code=400, detail="Could not generate a valid slug from input")
    return slug_res(original=url_input, slug=slug)
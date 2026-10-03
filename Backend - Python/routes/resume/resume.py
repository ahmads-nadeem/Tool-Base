from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
router = APIRouter(
    prefix="/resume",    
    tags=["Resume Workspace"] 
)

class resumeModel(BaseModel):
    title: str
    

router.post('/resume-generator')
def resume(data: resumeModel):
    print('resume')
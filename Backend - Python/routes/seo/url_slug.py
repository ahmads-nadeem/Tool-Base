import requests
from slugify import slugify
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
router = APIRouter(
    prefix="/seo",    
    tags=["SEO Workspace"] 
)
def detect_rendering_type(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.get(url, headers=headers)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    # 1. WordPress Check
    if "wp-content" in html or "wp-includes" in html:
        return "static", html  # WordPress traditional SSR hai

    # 2. React CSR (Client-Side Rendering) Check
    root_div = soup.find("div", id="root") or soup.find("div", id="app")
    if root_div and len(root_div.get_text(strip=True)) == 0:
        if soup.find_all("script"):
            return "dynamic_csr", html
    # 3. Standard Static/SSR Page
    return "static", html

def scrape_static_seo(html_content: str):
    soup = BeautifulSoup(html_content, "html.parser")
    titles = soup.find_all("title")
    meta_des = soup.find_all("meta", attrs={"name": "description"})
    return {
        "method": "Fast Static Parser (httpx)",
        "title": titles[0].text if titles else None,
        "title_count": len(titles),
        "description": meta_des[0]["content"] if meta_des else None,
        "desc_count": len(meta_des),
    }
class url_req(BaseModel):
    url_field: str
    @field_validator('url_field')
    def is_empty(cls, value: str)->str:
        if not value.strip():
            raise ValueError("Input URL cannot be empty")
        return value
class audit_res(BaseModel):
    title: str
    description: str
    # web_type:str

@router.post('/audit', response_model=audit_res)    
def audit(url_field: url_req):
    if not url_field or not url_field.url_field:
        raise HTTPException(status_code=400, detail="Could not process this")

    techType, htmlData = detect_rendering_type(url_field.url_field)
    if (techType == "static"):
        responseData = scrape_static_seo(htmlData)
        return audit_res(
                title = responseData["title"],
                description = responseData["description"]
            )
    # print(web_type)
    
    
    





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
def slug(slug_field: slug_req):
    print(slug_field)
    url_input = slug_field.slug_field
    print(url_input)
    slug = slugify(url_input)
    if not slug:
        raise HTTPException(status_code=400, detail="Could not generate a valid slug from input")
    return slug_res(original=url_input, slug=slug)
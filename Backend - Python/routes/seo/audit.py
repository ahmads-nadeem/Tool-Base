# import asyncio
import requests
# from pyppeteer import launch
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright #type: ignore
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
router = APIRouter()
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

def commonAudit(soup):
    titles = soup.find_all("title")
    meta_des = soup.find_all("meta", attrs={"name": "description"})
    # Open Graph
    og_image_tag = soup.find("meta", attrs={"property": "og:image"}) or soup.find("meta", attrs={"name": "og:image"})
    og_image = og_image_tag["content"] if og_image_tag and og_image_tag.has_attr("content") else None

    og_url_tag = soup.find("meta", attrs={"property": "og:url"}) or soup.find("meta", attrs={"name": "og:url"})
    og_url = og_url_tag["content"] if og_url_tag and og_url_tag.has_attr("content") else None

    og_title_tag = soup.find("meta", attrs={"property": "og:title"}) or soup.find("meta", attrs={"name": "og:title"})
    og_title = og_title_tag["content"] if og_title_tag and og_title_tag.has_attr("content") else None
    
    og_desc_tag = soup.find("meta", attrs={"property": "og:description"}) or soup.find("meta", attrs={"name": "og:description"})
    og_description = og_desc_tag["content"] if og_desc_tag and og_desc_tag.has_attr("content") else None

    # Twitter Cards
    twitter_title_tag = soup.find("meta", attrs={"property": "twitter:title"}) or soup.find("meta", attrs={"name": "twitter:title"})
    twitter_title = twitter_title_tag["content"] if twitter_title_tag and twitter_title_tag.has_attr("content") else None
    
    twitter_description_tag = soup.find("meta", attrs={"property": "twitter:description"}) or soup.find("meta", attrs={"name": "twitter:description"})
    twitter_description = twitter_description_tag["content"] if twitter_description_tag and twitter_description_tag.has_attr("content") else None
    
    twitter_image_tag = soup.find("meta", attrs={"property": "twitter:image"}) or soup.find("meta", attrs={"name": "twitter:image"})
    twitter_image = twitter_image_tag["content"] if twitter_image_tag and twitter_image_tag.has_attr("content") else None
    
    # Headings
    h1_tags_list = soup.find_all("h1")
    h2_tags_list = soup.find_all("h2")
    h1 = []
    h2 = []
    for item in h1_tags_list:
        h1.append(item.get_text(separator=" ", strip=True))
    for h2_items in h2_tags_list:
        h2.append(h2_items.get_text(separator=" ", strip=True))
    return titles, meta_des, og_title, og_description, og_url, og_image, twitter_title, twitter_description, twitter_image, h1, h2

def scrape_dynamic_seo(url: str):
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        html_content = page.content()
        browser.close()
        soupData = BeautifulSoup(html_content, "html.parser")
        titles, meta_des, og_title, og_description, og_url, og_image, twitter_title, twitter_description, twitter_image, h1, h2 = commonAudit(soupData)
    return {
        "title": titles[0].text if titles else None,
        "description": meta_des[0]["content"] if meta_des and meta_des[0].has_attr("content") else None,
        "og_title": og_title,
        "og_description": og_description,
        "og_url": og_url,
        "og_image": og_image,
        "twitter_title": twitter_title,
        "twitter_desc": twitter_description,
        "twitter_image": twitter_image,
        "h1": h1,
        "h2": h2
    }
def scrape_static_seo(html_content: str):
    soupData = BeautifulSoup(html_content, "html.parser")
    titles, meta_des, og_title, og_description, og_url, og_image, twitter_title, twitter_description, twitter_image, h1, h2 = commonAudit(soupData)
    return {
        "method": "Fast Static Parser (httpx)",
        "title": titles[0].text if titles else None,
        "description": meta_des[0]["content"] if meta_des else None,
        "og_title": og_title,
        "og_description": og_description,
        "og_url": og_url,
        "og_image": og_image,
        "twitter_title": twitter_title,
        "twitter_desc": twitter_description,
        "twitter_image": twitter_image,
        "h1": h1,
        "h2": h2
    }
class url_req(BaseModel):
    url_field: str
    @field_validator('url_field')
    def is_empty(cls, value: str)->str:
        if not value.strip():
            raise ValueError("Input URL cannot be empty")
        return value
class audit_res(BaseModel):
    title: str | None
    description: str | None
    ogTitle: str | None
    ogDes: str | None
    og_url: str | None
    og_image: str | None
    twitter_title: str | None
    twitter_desc: str | None
    twitter_image: str | None
    h1: list[str] | None
    h2: list[str] | None
@router.post('/audit', response_model=audit_res)    
def audit(payload: url_req):
    if not payload or not payload.url_field:
        raise HTTPException(status_code=400, detail="Could not process this")
    techType, htmlData = detect_rendering_type(payload.url_field)
    if (techType == "static"):
        responseData = scrape_static_seo(htmlData)
    else:
        responseData = scrape_dynamic_seo(payload.url_field)
    # print(f"Title:{responseData["title"]} \n Description:{responseData["description"]} \n OG-Title:{responseData["og_title"]} \n OG-Description:{responseData["og_description"]} \n H1:{responseData["h1"]} \n H2:{responseData["h2"]}")
    # print(responseData["twitter_desc"])
    return audit_res(
                        title = responseData["title"],
                        description = responseData["description"],
                        ogTitle = responseData["og_title"],
                        ogDes = responseData["og_description"],
                        og_url = responseData["og_url"],
                        og_image = responseData["og_image"],
                        twitter_title = responseData["twitter_title"],
                        twitter_desc = responseData["twitter_desc"],
                        twitter_image = responseData["twitter_image"],
                        h1 = responseData["h1"],
                        h2 = responseData["h2"]
                    )





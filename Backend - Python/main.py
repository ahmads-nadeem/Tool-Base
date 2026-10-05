from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.seo import url_slug, audit

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(
    url_slug.router,
    prefix='/seo',
    tags=["seo work space"]
    )

app.include_router(
    audit.router,
    prefix="/seo",    
    tags=["SEO Workspace"]
    )


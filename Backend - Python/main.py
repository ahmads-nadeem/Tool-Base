from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.seo import url_slug, audit

app = FastAPI()
origins = [
    "https://toolbasewebsite.vercel.app", # Aapka Vercel domain
    # "http://localhost:3000",               # Local development ke liye
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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


"use client"
import {
  Search,
  Map,
  Hash,
  FileText,
  Braces,
  Tags,
  Heading,
  Share2,
  Link2,
  Unlink,
  Link,
  Image,
} from "lucide-react";

const seoTools = [
  {
    title: "SEO Audit",
    description: "Full website health check — speed, structure, on-page issues.",
    icon: Search,
    href: "/seo/audit",
  },
  {
    title: "Sitemap Generator",
    description: "Generate an XML sitemap for search engine crawling.",
    icon: Map,
    href: "/seo/sitemap-generator",
  },
  {
    title: "Keyword Density Checker",
    description: "Analyze keyword frequency and usage across your content.",
    icon: Hash,
    href: "/seo/keyword-density",
  },
  {
    title: "Robots.txt",
    description: "Generate and validate your robots.txt crawl rules.",
    icon: FileText,
    href: "/seo/robots-txt",
  },
  {
    title: "Schema Markup / Structured Data",
    description: "Create and validate JSON-LD structured data.",
    icon: Braces,
    href: "/seo/schema-markup",
  },
  {
    title: "Meta Tag",
    description: "Check and generate meta title & description tags.",
    icon: Tags,
    href: "/seo/meta-tag",
  },
  {
    title: "H1, H2 Checker",
    description: "Audit heading structure and hierarchy of a page.",
    icon: Heading,
    href: "/seo/heading-checker",
  },
  {
    title: "OG Tag Analyser",
    description: "Inspect Open Graph tags for social share previews.",
    icon: Share2,
    href: "/seo/og-tag-analyser",
  },
  {
    title: "Backlinks Analyse",
    description: "Review backlink profile and referring domains.",
    icon: Link2,
    href: "/seo/backlinks-analyse",
  },
  {
    title: "Broken Link Checker",
    description: "Scan a page or site for dead or broken links.",
    icon: Unlink,
    href: "/seo/broken-link-checker",
  },
  {
    title: "URL Slug Generator",
    description: "Create clean, SEO-friendly URL slugs from any title.",
    icon: Link,
    href: "/seo/url-slug-generator",
  },
  {
    title: "Image Size & Type Detection",
    description: "Check image dimensions, format, and file size for SEO.",
    icon: Image,
    href: "/seo/image-detection",
  },
];

export default function SeoToolsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            SEO <span className="text-red-600">Tools</span>
          </h1>
          <p className="mt-2 text-white/60 text-sm sm:text-base">
            Sab SEO tools ek jagah — audit, analysis aur optimization ke liye.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {seoTools.map(({ title, description, icon: Icon, href }) => (
            <a
              key={title}
              href={href}
              className="group relative bg-zinc-950 border border-white/10 rounded-xl p-5 hover:border-red-600/60 hover:bg-zinc-900 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-red-600/10 border border-red-600/20 mb-4 group-hover:bg-red-600/20 transition-colors duration-200">
                <Icon className="w-5 h-5 text-red-500" />
              </div>

              <h2 className="text-white font-semibold text-base mb-1.5">
                {title}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                {description}
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-medium text-red-500/80 group-hover:text-red-500">
                Open Tool
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
// components/Footer.tsx
// Add <Footer /> inside app/layout.tsx, below {children}, so it shows on every page.
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.webp"

const toolLinks = [
  { label: "Resume Generator", href: "/resume-generator" },
  { label: "SEO", href: "/seo" },
  { label: "Images", href: "/images" },
  { label: "Files", href: "/files" },
  { label: "Barcode", href: "/barcode" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-neutral-400 transition hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            {/* Replace with your real logo path */}
            <Image src={logo} alt="Your Brand logo" width={60} height={50} />
            <span className="text-lg font-semibold">SUDO</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            Simple online tools for resumes, SEO, images, files and barcodes.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://github.com/" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-red-600/70 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
              </svg>
            </a>
            <a href="https://linkedin.com/" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-red-600/70 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.75 9.75h3.83v1.54h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.58V21h-4z" />
              </svg>
            </a>
            <a href="https://x.com/" aria-label="X (Twitter)" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-red-600/70 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25H8.08l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
              </svg>
            </a>
          </div>
        </div>

        <LinkColumn title="Tools" links={toolLinks} />
        <LinkColumn title="Company" links={companyLinks} />
        <LinkColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
          <p>Made for people who like getting things done.</p>
        </div>
      </div>
    </footer>
  );
}
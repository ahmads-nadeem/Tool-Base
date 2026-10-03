// // app/page.tsx  (Next.js App Router)
import Link from "next/link";
import type { ReactNode } from "react";




type Tool = {
  name: string;
  href: string;
  description: string;
  action: string;
  icon: ReactNode;
  featured?: boolean;
};

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const tools: Tool[] = [
  {
    name: "Resume Generator",
    href: "/resume-generator",
    description:
      "Fill in your details, pick a clean layout, and download a ready-to-send resume as a PDF.",
    action: "Build a resume",
    featured: true,
    icon: (
      <svg {...iconProps}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    name: "SEO",
    href: "/seo",
    description: "Check titles, meta tags and keywords so your pages are easier to find.",
    action: "Check a page",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5M8 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "Images",
    href: "/images",
    description: "Resize, compress and convert images without losing quality.",
    action: "Edit images",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m21 16-5-5-9 9" />
      </svg>
    ),
  },
  {
    name: "Files",
    href: "/files",
    description: "Convert, merge and split documents in a few clicks.",
    action: "Manage files",
    icon: (
      <svg {...iconProps}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    name: "Barcode",
    href: "/barcode",
    description: "Generate barcodes for products, tickets and inventory, then save them as images.",
    action: "Create a barcode",
    icon: (
      <svg {...iconProps}>
        <path d="M4 5v14M8 5v14M12 5v14M16 5v14M20 5v14" strokeWidth={1.2} />
        <path d="M6 5v14M14 5v14M18 5v14" strokeWidth={2.4} />
      </svg>
    ),
  },
];






const steps = [
  { title: "Pick a tool", text: "Choose what you need from the menu or the cards above." },
  { title: "Add your input", text: "Type your details or drop in your files. Nothing to install." },
  { title: "Download the result", text: "Save your finished file straight to your device." },
];

const benefits = [
  {
    title: "Simple to use",
    text: "Every tool has one clear job and a clean screen, so you never hunt for a button.",
    icon: (
      <svg {...iconProps}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    ),
  },
  {
    title: "Works on any device",
    text: "Use it on your phone, tablet or laptop. The layout adjusts to your screen.",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: "Many tools, one place",
    text: "Stop searching for a new site every time. Resumes, images, files and more live together.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Download in one click",
    text: "Get your PDF, image or barcode as a file you can use right away.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "Do I need an account to use the tools?",
    a: "Add your answer here. For example: no account is needed, just open a tool and start.",
  },
  {
    q: "What file types can I use?",
    a: "Add your answer here. List the image and document formats your tools support.",
  },
  {
    q: "Are my files stored on your server?",
    a: "Add your answer here. Explain how long files are kept, or that they are deleted after processing.",
  },
  {
    q: "Can I use the results for commercial work?",
    a: "Add your answer here. State your usage terms clearly.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-red-700/20 blur-[140px]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28 lg:pb-28">
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Small jobs, done fast. Every tool in one place.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
            Build a resume, check your SEO, shrink an image, convert a file or
            make a barcode. Pick a tool and get started.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#tools"
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Browse tools
            </Link>
            <Link
              href="/resume-generator"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-neutral-200 transition hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Make a resume
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Choose a tool
        </h2>
        <p className="mt-2 text-neutral-400">
          Everything is available from the menu at the top, too.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-red-600/70 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${tool.featured ? "lg:col-span-2 lg:p-9" : ""
                }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/15 text-red-500 transition group-hover:bg-red-600 group-hover:text-white">
                {tool.icon}
              </span>
              <h3
                className={`mt-6 font-semibold ${tool.featured ? "text-2xl" : "text-xl"
                  }`}
              >
                {tool.name}
              </h3>
              <p className="mt-2 max-w-md leading-relaxed text-neutral-400">
                {tool.description}
              </p>
              <span className="mt-6 pt-2 text-sm font-medium text-red-500 transition group-hover:text-red-400">
                {tool.action}
              </span>
            </Link>
          ))}
        </div>
      </section>
      {/* How it works */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Three steps from start to finish
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-red-600/60 bg-red-600/10 text-lg font-semibold text-red-500">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-14 right-0 top-5 hidden h-px bg-gradient-to-r from-red-600/40 to-transparent md:block"
                  />
                )}
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-neutral-400">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Resume spotlight */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              A resume you can finish in minutes
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-400">
              Add your experience, skills and education once. The Resume
              Generator lays everything out neatly and gives you a PDF to send.
            </p>
            <ul className="mt-8 space-y-4 text-neutral-300">
              {["Clean, readable layouts", "Edit and download again anytime", "PDF that opens on any device"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-500" aria-hidden>
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                    {item}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/resume-generator"
              className="mt-10 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Build a resume
            </Link>
          </div>

          {/* Mock resume preview */}
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute -inset-6 rounded-3xl bg-red-700/15 blur-3xl" />
            <div aria-hidden className="relative rotate-2 rounded-xl border border-white/10 bg-neutral-100 p-8 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-neutral-300" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-neutral-800" />
                  <div className="h-3 w-24 rounded bg-red-500" />
                </div>
              </div>
              <div className="mt-7 space-y-2">
                <div className="h-2.5 w-full rounded bg-neutral-300" />
                <div className="h-2.5 w-11/12 rounded bg-neutral-300" />
                <div className="h-2.5 w-4/5 rounded bg-neutral-300" />
              </div>
              <div className="mt-7 h-3 w-24 rounded bg-neutral-800" />
              <div className="mt-3 space-y-2">
                <div className="h-2.5 w-full rounded bg-neutral-300" />
                <div className="h-2.5 w-10/12 rounded bg-neutral-300" />
              </div>
              <div className="mt-7 h-3 w-20 rounded bg-neutral-800" />
              <div className="mt-3 flex flex-wrap gap-2">
                {[16, 20, 14, 18].map((w, i) => (
                  <div key={i} className="h-5 rounded-full bg-red-100" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Why people use it
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-600/15 text-red-500">
                  {b.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-1.5 max-w-sm leading-relaxed text-neutral-400">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Questions and answers
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-red-500 transition group-open:rotate-45" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-red-700 to-red-900 px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get your next task done?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-red-100/90">
            Open a tool and be finished before your tea gets cold.
          </p>
          <Link
            href="#tools"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Choose a tool
          </Link>
        </div>
      </section>







    </main>
  );
}

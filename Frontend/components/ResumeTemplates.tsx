"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ResumeData = {
  basics: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    links: { label: string; url: string }[];
    summary: string;
    /** Image ka URL (server path ya local blob: preview). Sirf Modern aur Sidebar mein dikhti hai */
    photo?: string;
  };
  experience: {
    company: string;
    role: string;
    location?: string;
    start: string;
    end: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
    details?: string;
  }[];
  skills: { group: string; items: string[] }[];
  projects: {
    name: string;
    link?: string;
    description: string;
    tech?: string[];
  }[];
};

export type TemplateId = "classic" | "modern" | "sidebar";

type TemplateProps = { data: ResumeData; accent: string };

/* ------------------------------------------------------------------ */
/* Sample data (baad mein form / API se aayega)                        */
/* ------------------------------------------------------------------ */

export const sampleResume: ResumeData = {
  basics: {
    name: "Ali Raza",
    title: "Full-Stack Software Engineer",
    email: "ali.raza@example.com",
    phone: "+92 300 1234567",
    location: "Gujranwala, Pakistan",
    links: [
      { label: "GitHub", url: "github.com/aliraza" },
      { label: "LinkedIn", url: "linkedin.com/in/aliraza" },
    ],
    summary:
      "Full-stack engineer with hands-on experience in the MERN stack and FastAPI. I build and ship production web applications, from database design and REST APIs to responsive React interfaces.",
  },
  experience: [
    {
      company: "Northwind Software",
      role: "Full-Stack Developer",
      location: "Lahore, PK",
      start: "Mar 2023",
      end: "Present",
      bullets: [
        "Built a pharmacy management system with React, Node.js and MySQL used by 12 branches.",
        "Designed REST APIs and role-based authentication, cutting manual billing work by 40%.",
        "Introduced reusable UI components that reduced new-page delivery time by half.",
      ],
    },
    {
      company: "Pixel Forge",
      role: "Junior Web Developer",
      location: "Remote",
      start: "Jun 2021",
      end: "Feb 2023",
      bullets: [
        "Developed client dashboards in React and Express with MongoDB.",
        "Wrote FastAPI microservices for reporting and PDF generation.",
      ],
    },
  ],
  education: [
    {
      school: "University of Gujrat",
      degree: "BS Computer Science",
      start: "2017",
      end: "2021",
      details: "Final-year project: hospital appointment and records system.",
    },
  ],
  skills: [
    { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express", "FastAPI", "REST APIs"] },
    { group: "Database", items: ["MySQL", "MongoDB", "Redis"] },
    { group: "Tools", items: ["Git", "Docker", "Playwright"] },
  ],
  projects: [
    {
      name: "Pharmacy Management App",
      link: "github.com/aliraza/pharmacy",
      description:
        "Inventory, sales and prescription tracking with JWT auth and role-based access.",
      tech: ["React", "Node.js", "MySQL"],
    },
    {
      name: "Website Audit Tool",
      description:
        "Crawls a URL and reports SEO, performance and accessibility issues.",
      tech: ["FastAPI", "Playwright"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const A4_W = "210mm";
const A4_H = "297mm";

function Page({
  children,
  fontFamily,
  padding = "16mm 18mm",
}: {
  children: React.ReactNode;
  fontFamily: string;
  padding?: string;
}) {
  return (
    <div
      className="resume-page bg-white text-[#1a1a1a] shadow-lg"
      style={{
        width: A4_W,
        minHeight: A4_H,
        padding,
        fontFamily,
        fontSize: "10.5pt",
        lineHeight: 1.45,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

const dateRange = (s: string, e: string) => `${s} – ${e}`;

function Photo({ src, size, border }: { src: string; size: string; border: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        objectFit: "cover",
        border,
        flexShrink: 0,
        display: "block",
      }}
    />
  );
}

function contactLine(d: ResumeData["basics"]) {
  return [d.email, d.phone, d.location, ...d.links.map((l) => l.url)].filter(Boolean);
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Template 1: Classic (single column, serif, ATS-safe)                */
/* ------------------------------------------------------------------ */

function ClassicTemplate({ data, accent }: TemplateProps) {
  const { basics, experience, education, skills, projects } = data;

  const Heading = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="mb-2 mt-5 border-b pb-0.5 text-[12pt] font-bold break-after-avoid"
      style={{ borderColor: accent, color: "#111" }}
    >
      {children}
    </h2>
  );

  return (
    <Page fontFamily='Georgia, "Times New Roman", serif'>
      <header className="text-center">
        <h1 className="text-[24pt] font-bold leading-tight tracking-tight">
          {basics.name}
        </h1>
        <p className="text-[11.5pt] italic" style={{ color: accent }}>
          {basics.title}
        </p>
        <p className="mt-1 text-[9.5pt] text-neutral-700">
          {contactLine(basics).join("  |  ")}
        </p>
      </header>

      {basics.summary && (
        <>
          <Heading>Summary</Heading>
          <p>{basics.summary}</p>
        </>
      )}

      <Heading>Experience</Heading>
      <div className="space-y-3">
        {experience.map((job, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-bold">
                {job.role}, <span className="font-normal">{job.company}</span>
              </p>
              <p className="shrink-0 text-[9.5pt] text-neutral-700">
                {dateRange(job.start, job.end)}
              </p>
            </div>
            {job.location && (
              <p className="text-[9.5pt] italic text-neutral-600">{job.location}</p>
            )}
            <Bullets items={job.bullets} />
          </div>
        ))}
      </div>

      <Heading>Education</Heading>
      <div className="space-y-2">
        {education.map((ed, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-bold">
                {ed.degree}, <span className="font-normal">{ed.school}</span>
              </p>
              <p className="shrink-0 text-[9.5pt] text-neutral-700">
                {dateRange(ed.start, ed.end)}
              </p>
            </div>
            {ed.details && <p className="text-[10pt]">{ed.details}</p>}
          </div>
        ))}
      </div>

      <Heading>Skills</Heading>
      <div className="space-y-0.5">
        {skills.map((s, i) => (
          <p key={i}>
            <span className="font-bold">{s.group}: </span>
            {s.items.join(", ")}
          </p>
        ))}
      </div>

      {projects.length > 0 && (
        <>
          <Heading>Projects</Heading>
          <div className="space-y-2">
            {projects.map((p, i) => (
              <div key={i} className="break-inside-avoid">
                <p>
                  <span className="font-bold">{p.name}</span>
                  {p.link && (
                    <span className="text-[9.5pt] text-neutral-600"> ({p.link})</span>
                  )}
                </p>
                <p>{p.description}</p>
                {p.tech && (
                  <p className="text-[9.5pt] italic text-neutral-600">
                    {p.tech.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Template 2: Modern (single column, accent header band)             */
/* ------------------------------------------------------------------ */

function ModernTemplate({ data, accent }: TemplateProps) {
  const { basics, experience, education, skills, projects } = data;

  const Heading = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="mb-2 mt-6 text-[12.5pt] font-bold break-after-avoid"
      style={{ color: accent }}
    >
      {children}
    </h2>
  );

  return (
    <Page fontFamily='Inter, "Segoe UI", Helvetica, Arial, sans-serif' padding="0">
      <header
        className="print-color text-white"
        style={{
          backgroundColor: accent,
          padding: "12mm 18mm 8mm 18mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8mm",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 className="text-[26pt] font-bold leading-none tracking-tight">
            {basics.name}
          </h1>
          <p className="mt-1.5 text-[12pt] font-medium opacity-95">{basics.title}</p>
          <p className="mt-3 text-[9.5pt] opacity-95">
            {contactLine(basics).join("   •   ")}
          </p>
        </div>
        {basics.photo && (
          <Photo
            src={basics.photo}
            size="34mm"
            border="1.2mm solid rgba(255,255,255,0.9)"
          />
        )}
      </header>

      <div style={{ padding: "2mm 18mm 14mm 18mm" }}>
        {basics.summary && (
          <>
            <Heading>Profile</Heading>
            <p>{basics.summary}</p>
          </>
        )}

        <Heading>Experience</Heading>
        <div className="space-y-4">
          {experience.map((job, i) => (
            <div key={i} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[11pt] font-semibold">{job.role}</p>
                <p className="shrink-0 text-[9.5pt] text-neutral-600">
                  {dateRange(job.start, job.end)}
                </p>
              </div>
              <p className="text-[10pt]" style={{ color: accent }}>
                {job.company}
                {job.location ? ` · ${job.location}` : ""}
              </p>
              <Bullets items={job.bullets} />
            </div>
          ))}
        </div>

        {projects.length > 0 && (
          <>
            <Heading>Projects</Heading>
            <div className="space-y-2.5">
              {projects.map((p, i) => (
                <div key={i} className="break-inside-avoid">
                  <p className="font-semibold">
                    {p.name}
                    {p.link && (
                      <span className="text-[9.5pt] font-normal text-neutral-500">
                        {" "}
                        {p.link}
                      </span>
                    )}
                  </p>
                  <p>{p.description}</p>
                  {p.tech && (
                    <p className="text-[9.5pt] text-neutral-600">{p.tech.join(" / ")}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <Heading>Education</Heading>
            <div className="space-y-2">
              {education.map((ed, i) => (
                <div key={i} className="break-inside-avoid">
                  <p className="font-semibold">{ed.degree}</p>
                  <p className="text-[10pt]">
                    {ed.school}, {dateRange(ed.start, ed.end)}
                  </p>
                  {ed.details && (
                    <p className="text-[9.5pt] text-neutral-600">{ed.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Heading>Skills</Heading>
            <div className="space-y-1">
              {skills.map((s, i) => (
                <p key={i} className="text-[10pt]">
                  <span className="font-semibold">{s.group}: </span>
                  {s.items.join(", ")}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Template 3: Sidebar (two columns, coloured left rail)              */
/* ------------------------------------------------------------------ */

function SidebarTemplate({ data, accent }: TemplateProps) {
  const { basics, experience, education, skills, projects } = data;

  const SideHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-1.5 mt-6 border-b border-white/40 pb-1 text-[11pt] font-bold">
      {children}
    </h3>
  );
  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="mb-2 mt-6 text-[13pt] font-bold break-after-avoid first:mt-0"
      style={{ color: accent }}
    >
      {children}
    </h2>
  );

  return (
    <Page fontFamily='"Segoe UI", Roboto, Helvetica, Arial, sans-serif' padding="0">
      <div className="grid" style={{ gridTemplateColumns: "68mm 1fr", minHeight: A4_H }}>
        {/* Sidebar */}
        <aside
          className="print-color text-white"
          style={{ backgroundColor: accent, padding: "14mm 8mm" }}
        >
          {basics.photo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2mm" }}>
              <Photo
                src={basics.photo}
                size="42mm"
                border="1.2mm solid rgba(255,255,255,0.9)"
              />
            </div>
          )}

          <SideHeading>Contact</SideHeading>
          <div className="space-y-1 break-words text-[9.5pt]">
            {contactLine(basics).map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>

          <SideHeading>Skills</SideHeading>
          <div className="space-y-2 text-[9.5pt]">
            {skills.map((s, i) => (
              <div key={i}>
                <p className="font-semibold">{s.group}</p>
                <p className="opacity-95">{s.items.join(", ")}</p>
              </div>
            ))}
          </div>

          <SideHeading>Education</SideHeading>
          <div className="space-y-2 text-[9.5pt]">
            {education.map((ed, i) => (
              <div key={i}>
                <p className="font-semibold">{ed.degree}</p>
                <p>{ed.school}</p>
                <p className="opacity-90">{dateRange(ed.start, ed.end)}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={{ padding: "14mm 10mm" }}>
          <div style={{ textAlign: "center", marginBottom: "4mm" }}>
            <h1
              style={{
                fontSize: "28pt",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "#111",
              }}
            >
              {basics.name}
            </h1>
            <p
              style={{
                marginTop: "1.5mm",
                fontSize: "12.5pt",
                fontWeight: 600,
                color: accent,
              }}
            >
              {basics.title}
            </p>
          </div>

          {basics.summary && (
            <>
              <MainHeading>Profile</MainHeading>
              <p>{basics.summary}</p>
            </>
          )}

          <MainHeading>Experience</MainHeading>
          <div className="space-y-4">
            {experience.map((job, i) => (
              <div key={i} className="break-inside-avoid">
                <p className="text-[11pt] font-semibold">{job.role}</p>
                <p className="text-[9.5pt] text-neutral-600">
                  {job.company}
                  {job.location ? `, ${job.location}` : ""} ·{" "}
                  {dateRange(job.start, job.end)}
                </p>
                <Bullets items={job.bullets} />
              </div>
            ))}
          </div>

          {projects.length > 0 && (
            <>
              <MainHeading>Projects</MainHeading>
              <div className="space-y-2.5">
                {projects.map((p, i) => (
                  <div key={i} className="break-inside-avoid">
                    <p className="font-semibold">{p.name}</p>
                    <p>{p.description}</p>
                    {p.tech && (
                      <p className="text-[9.5pt] text-neutral-600">
                        {p.tech.join(" / ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Public component: <ResumePreview />                                 */
/* Isi ko /print/[template] page aur live preview, dono mein use karein */
/* ------------------------------------------------------------------ */

export const TEMPLATES: Record<
  TemplateId,
  { label: string; defaultAccent: string; Component: (p: TemplateProps) => React.ReactElement }
> = {
  classic: { label: "Classic", defaultAccent: "#1f3a5f", Component: ClassicTemplate },
  modern: { label: "Modern", defaultAccent: "#0f766e", Component: ModernTemplate },
  sidebar: { label: "Sidebar", defaultAccent: "#334e68", Component: SidebarTemplate },
};

export function ResumePreview({
  data,
  template,
  accent,
}: {
  data: ResumeData;
  template: TemplateId;
  accent?: string;
}) {
  const { Component, defaultAccent } = TEMPLATES[template];
  return <Component data={data} accent={accent ?? defaultAccent} />;
}

/* ------------------------------------------------------------------ */
/* Demo page: template switcher + accent colour + print               */
/* ------------------------------------------------------------------ */

const PRINT_CSS = `
  .print-color { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 0; }
  @media print {
    body { background: #fff !important; }
    .no-print { display: none !important; }
    .preview-zoom { zoom: 1 !important; }
    .resume-page { box-shadow: none !important; }
  }
`;

export default function ResumeBuilderDemo() {
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [accent, setAccent] = useState<string>(TEMPLATES.classic.defaultAccent);
  const [zoom, setZoom] = useState(0.8);

  const pick = (id: TemplateId) => {
    setTemplate(id);
    setAccent(TEMPLATES[id].defaultAccent);
  };

  return (
    <div className="min-h-screen bg-neutral-200 py-6">
      <style>{PRINT_CSS}</style>

      <div className="no-print mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center gap-3 rounded-lg bg-white p-3 shadow">
        <div className="flex gap-1.5">
          {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
            <button
              key={id}
              onClick={() => pick(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                template === id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {TEMPLATES[id].label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          Accent
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-neutral-300"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          Zoom
          <input
            type="range"
            min={0.4}
            max={1}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>

        <button
          onClick={() => window.print()}
          className="ml-auto rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <div className="preview-zoom" style={{ zoom }}>
          <ResumePreview data={sampleResume} template={template} accent={accent} />
        </div>
      </div>
    </div>
  );
}
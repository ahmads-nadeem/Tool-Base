"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResumePreview,
  TEMPLATES,
  sampleResume,
  type ResumeData,
  type TemplateId,
} from "@/components/ResumeTemplates";

type ListKey = "experience" | "education" | "skills" | "projects";
type Item<K extends ListKey> = ResumeData[K][number];

const blank = {
  experience: (): Item<"experience"> => ({
    company: "",
    role: "",
    location: "",
    start: "",
    end: "",
    bullets: [""],
  }),
  education: (): Item<"education"> => ({
    school: "",
    degree: "",
    start: "",
    end: "",
    details: "",
  }),
  skills: (): Item<"skills"> => ({ group: "", items: [] }),
  projects: (): Item<"projects"> => ({
    name: "",
    link: "",
    description: "",
    tech: [],
  }),
};

const emptyResume = (): ResumeData => ({
  basics: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    links: [{ label: "Link", url: "" }],
    summary: "",
  },
  experience: [blank.experience()],
  education: [blank.education()],
  skills: [blank.skills()],
  projects: [],
});

/* Preview ko sirf wohi data do jo user ne actually bhara hai */
function cleanResume(d: ResumeData): ResumeData {
  const t = (s: string) => s.trim();
  return {
    basics: {
      ...d.basics,
      links: d.basics.links.filter((l) => t(l.url)),
    },
    experience: d.experience
      .filter((e) => t(e.role) || t(e.company))
      .map((e) => ({ ...e, bullets: e.bullets.map(t).filter(Boolean) })),
    education: d.education.filter((e) => t(e.school) || t(e.degree)),
    skills: d.skills
      .map((s) => ({ ...s, items: s.items.map(t).filter(Boolean) }))
      .filter((s) => s.items.length > 0),
    projects: d.projects
      .filter((p) => t(p.name))
      .map((p) => {
        const tech = p.tech?.map(t).filter(Boolean);
        return { ...p, tech: tech && tech.length ? tech : undefined };
      }),
  };
}

/* Photo select karne par server par NAHI jati. Sirf "Download PDF" par, PDF request ke saath jati hai */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ------------------------------------------------------------------ */
/* Small UI pieces (dark black / red theme)                            */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-neutral-800 bg-neutral-900"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
        {title}
        <span className="text-neutral-500 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="space-y-4 border-t border-neutral-800 px-4 py-4">{children}</div>
    </details>
  );
}

function ItemCard({
  title,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  children: React.ReactNode;
}) {
  const btn =
    "rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500";
  return (
    <div className="space-y-3 rounded-md border border-neutral-800 bg-neutral-950 p-3">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-neutral-200">{title}</p>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={onUp} className={btn} aria-label="Move up">
            ↑
          </button>
          <button type="button" onClick={onDown} className={btn} aria-label="Move down">
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md border border-dashed border-neutral-600 py-2 text-sm font-medium text-neutral-300 hover:border-red-500 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "resume-builder:v1";

const PRINT_CSS = `
  .print-color { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 0; }
  @media print {
    body { background: #fff !important; }
    .no-print { display: none !important; }
    .builder-root, .builder-scroll { height: auto !important; overflow: visible !important; background: #fff !important; }
    .preview-panel { display: block !important; background: #fff !important; padding: 0 !important; }
    .preview-zoom { zoom: 1 !important; }
    .resume-page { box-shadow: none !important; }
  }
`;

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [accent, setAccent] = useState<string>(TEMPLATES.classic.defaultAccent);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [zoom, setZoom] = useState(0.8);
  const [loaded, setLoaded] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null); // asli file, memory mein
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // local blob: URL
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  /* rev badhne par uncontrolled inputs (bullets, skills) dobara mount hote hain */
  const [rev, setRev] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  /* Load saved data (sirf client par) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.data) {
          if (saved.data.basics) delete saved.data.basics.photo; // photo ab save nahi hoti
          setData(saved.data);
        }
        if (saved.template && saved.template in TEMPLATES) setTemplate(saved.template);
        if (saved.accent) setAccent(saved.accent);
        setRev((r) => r + 1);
      }
    } catch {
      /* corrupt ya blocked storage: ignore */
    }
    setLoaded(true);
  }, []);

  /* Auto-save (photo bhi isi mein save hoti hai) */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, template, accent }));
    } catch {
      /* ignore */
    }
  }, [data, template, accent, loaded]);

  /* Preview ko panel ki width ke hisab se fit karo */
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const A4_PX = 210 * 3.7795;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth - 32;
      if (w > 0) setZoom(Math.min(1, w / A4_PX));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- state helpers ---------- */

  const setBasics = (patch: Partial<ResumeData["basics"]>) =>
    setData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));

  const dropPreview = () =>
    setPhotoPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    setPhotoError("");
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Sirf JPG, PNG ya WebP image select karein.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image 5MB se choti honi chahiye.");
      return;
    }
    /* Server ko kuch nahi bheja: file sirf browser ki memory mein rakhi hai */
    const local = URL.createObjectURL(file);
    setPhotoPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return local;
    });
    setPhotoFile(file);
  };

  const removePhoto = () => {
    dropPreview();
    setPhotoFile(null);
    setPhotoError("");
  };

  const setLink = (i: number, url: string) =>
    setData((d) => ({
      ...d,
      basics: {
        ...d.basics,
        links: d.basics.links.map((l, idx) => (idx === i ? { ...l, url } : l)),
      },
    }));
  const addLink = () =>
    setData((d) => ({
      ...d,
      basics: { ...d.basics, links: [...d.basics.links, { label: "Link", url: "" }] },
    }));
  const removeLink = (i: number) =>
    setData((d) => ({
      ...d,
      basics: { ...d.basics, links: d.basics.links.filter((_, idx) => idx !== i) },
    }));

  function patchItem<K extends ListKey>(key: K, i: number, patch: Partial<Item<K>>) {
    setData(
      (d) =>
        ({
          ...d,
          [key]: (d[key] as Item<K>[]).map((it, idx) =>
            idx === i ? { ...it, ...patch } : it
          ),
        }) as ResumeData
    );
  }
  function addItem<K extends ListKey>(key: K) {
    setData(
      (d) => ({ ...d, [key]: [...(d[key] as Item<K>[]), blank[key]()] }) as ResumeData
    );
    setRev((r) => r + 1);
  }
  function removeItem<K extends ListKey>(key: K, i: number) {
    setData(
      (d) =>
        ({ ...d, [key]: (d[key] as Item<K>[]).filter((_, idx) => idx !== i) }) as ResumeData
    );
    setRev((r) => r + 1);
  }
  function moveItem<K extends ListKey>(key: K, i: number, dir: -1 | 1) {
    setData((d) => {
      const list = [...(d[key] as Item<K>[])];
      const j = i + dir;
      if (j < 0 || j >= list.length) return d;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...d, [key]: list } as ResumeData;
    });
    setRev((r) => r + 1);
  }

  const loadSample = () => {
    setData(sampleResume);
    setRev((r) => r + 1);
  };
  const clearAll = () => {
    if (!window.confirm("Saara data clear kar dein?")) return;
    setData(emptyResume());
    dropPreview();
    setPhotoFile(null);
    setRev((r) => r + 1);
  };
  const pickTemplate = (id: TemplateId) => {
    setTemplate(id);
    setAccent(TEMPLATES[id].defaultAccent);
  };

  const { basics } = data;
  const lines = (s: string) => s.split("\n");
  const commas = (s: string) => s.split(",").map((x) => x.trim());
  const supportsPhoto = template !== "classic";
  const shownPhoto = photoPreview ?? undefined;
  const cleaned = cleanResume(data);
  const previewData: ResumeData = {
    ...cleaned,
    basics: { ...cleaned.basics, photo: shownPhoto },
  };

  /* Ek hi request: JSON data + photo file (multipart/form-data) -> PDF wapas */
  async function downloadPdf() {
    setPdfError("");
    setPdfLoading(true);
    try {
      const body = cleanResume(data);
      const basicsNoPhoto = { ...body.basics };
      delete basicsNoPhoto.photo; // photo JSON mein nahi, alag file part mein jati hai

      const form = new FormData();
      form.append("data", JSON.stringify({ ...body, basics: basicsNoPhoto }));
      form.append("template", template);
      form.append("accent", accent);
      if (photoFile && supportsPhoto) form.append("photo", photoFile);

      let res: Response;
      try {
        res = await fetch(`${API_URL}/resume/pdf`, { method: "POST", body: form });
      } catch {
        throw new Error(
          `Backend se connect nahi ho saka (${API_URL}). FastAPI chal raha hai? CORS check karein.`
        );
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(typeof err?.detail === "string" ? err.detail : "PDF nahi ban saki.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const safeName = (basics.name || "resume").trim().replace(/[^\w\- ]+/g, "").replace(/\s+/g, "_");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName || "resume"}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : "PDF nahi ban saki.");
    } finally {
      setPdfLoading(false);
    }
  }

  /* ---------- render ---------- */

  return (
    <div
      className="builder-root flex min-h-screen flex-col bg-neutral-950 text-neutral-100 lg:h-screen"
      style={{ colorScheme: "dark" }}
    >
      <style>{PRINT_CSS}</style>

      {/* Top bar */}
      <div className="no-print flex flex-wrap items-center gap-3 border-b border-red-950 bg-black px-4 py-2.5">
        <div className="flex gap-1.5">
          {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
            <button
              key={id}
              onClick={() => pickTemplate(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                template === id
                  ? "bg-red-600 text-white"
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              {TEMPLATES[id].label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          Accent
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-neutral-700 bg-transparent"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={loadSample}
            className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Load sample
          </button>
          <button
            onClick={clearAll}
            className="rounded-md px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Clear
          </button>
          <button
            onClick={downloadPdf}
            disabled={pdfLoading}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-wait disabled:opacity-60"
          >
            {pdfLoading ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      </div>

      {pdfError && (
        <p
          role="alert"
          className="no-print border-b border-red-950 bg-red-950/40 px-4 py-2 text-sm text-red-300"
        >
          {pdfError}
        </p>
      )}

      {/* Mobile tabs */}
      <div className="no-print flex border-b border-neutral-800 bg-black lg:hidden">
        {(["edit", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium ${
              tab === t ? "border-b-2 border-red-500 text-white" : "text-neutral-500"
            }`}
          >
            {t === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-3">
        {/* ================= FORM ================= */}
        <div
          className={`builder-scroll no-print space-y-3 overflow-y-auto p-4 lg:col-span-1 ${
            tab === "edit" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Personal info */}
          <Section title="Personal info" defaultOpen>
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-950">
                {shownPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={shownPhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-neutral-500">No photo</span>
                )}
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer rounded-md bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-100 hover:bg-neutral-700 focus-within:outline focus-within:outline-2 focus-within:outline-red-500">
                    {shownPhoto ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        handlePhoto(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {shownPhoto && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="rounded-md px-3 py-1.5 text-sm text-red-400 hover:bg-red-950"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-neutral-500">
                  {supportsPhoto
                    ? "Photo sirf PDF banate waqt server par jati hai. Refresh ke baad dobara select karni hogi."
                    : "Classic template mein photo nahi dikhti (ATS ke liye). Modern ya Sidebar select karein."}
                </p>
                {photoError && <p className="text-xs text-red-400">{photoError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="Full name"
                value={basics.name}
                onChange={(v) => setBasics({ name: v })}
                placeholder="Ali Raza"
              />
              <TextField
                label="Job title"
                value={basics.title}
                onChange={(v) => setBasics({ title: v })}
                placeholder="Full-Stack Developer"
              />
              <TextField
                label="Email"
                type="email"
                value={basics.email}
                onChange={(v) => setBasics({ email: v })}
                placeholder="you@example.com"
              />
              <TextField
                label="Phone"
                type="tel"
                value={basics.phone}
                onChange={(v) => setBasics({ phone: v })}
                placeholder="+92 300 1234567"
              />
              <TextField
                label="Address / City"
                value={basics.location}
                onChange={(v) => setBasics({ location: v })}
                placeholder="Gujranwala, Pakistan"
                className="sm:col-span-2"
              />
            </div>
            <Field label="Summary">
              <textarea
                rows={4}
                value={basics.summary}
                onChange={(e) => setBasics({ summary: e.target.value })}
                placeholder="2-3 lines mein apne baare mein likhein"
                className={inputCls}
              />
            </Field>
          </Section>

          {/* Links */}
          <Section title="Links">
            {basics.links.map((l, i) => (
              <div key={`${rev}-link-${i}`} className="flex items-end gap-2">
                <TextField
                  label={`Link ${i + 1}`}
                  value={l.url}
                  onChange={(v) => setLink(i, v)}
                  placeholder="github.com/username"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="mb-0.5 rounded px-2 py-1.5 text-xs text-red-400 hover:bg-red-950"
                >
                  Remove
                </button>
              </div>
            ))}
            <AddButton onClick={addLink}>Add link (GitHub, LinkedIn, portfolio)</AddButton>
          </Section>

          {/* Experience */}
          <Section title="Experience">
            {data.experience.map((job, i) => (
              <ItemCard
                key={`${rev}-exp-${i}`}
                title={job.role || job.company || `Experience ${i + 1}`}
                onRemove={() => removeItem("experience", i)}
                onUp={() => moveItem("experience", i, -1)}
                onDown={() => moveItem("experience", i, 1)}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField
                    label="Role"
                    value={job.role}
                    onChange={(v) => patchItem("experience", i, { role: v })}
                  />
                  <TextField
                    label="Company"
                    value={job.company}
                    onChange={(v) => patchItem("experience", i, { company: v })}
                  />
                  <TextField
                    label="Start"
                    value={job.start}
                    onChange={(v) => patchItem("experience", i, { start: v })}
                    placeholder="Mar 2023"
                  />
                  <TextField
                    label="End"
                    value={job.end}
                    onChange={(v) => patchItem("experience", i, { end: v })}
                    placeholder="Present"
                  />
                  <TextField
                    label="Location (optional)"
                    value={job.location ?? ""}
                    onChange={(v) => patchItem("experience", i, { location: v })}
                    className="sm:col-span-2"
                  />
                </div>
                <Field label="What did you do? (ek line = ek bullet)">
                  <textarea
                    rows={4}
                    defaultValue={job.bullets.join("\n")}
                    onChange={(e) =>
                      patchItem("experience", i, { bullets: lines(e.target.value) })
                    }
                    placeholder={"Built X using Y\nImproved Z by 40%"}
                    className={inputCls}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("experience")}>Add experience</AddButton>
          </Section>

          {/* Education */}
          <Section title="Education">
            {data.education.map((ed, i) => (
              <ItemCard
                key={`${rev}-edu-${i}`}
                title={ed.degree || ed.school || `Education ${i + 1}`}
                onRemove={() => removeItem("education", i)}
                onUp={() => moveItem("education", i, -1)}
                onDown={() => moveItem("education", i, 1)}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField
                    label="Degree"
                    value={ed.degree}
                    onChange={(v) => patchItem("education", i, { degree: v })}
                    placeholder="BS Computer Science"
                  />
                  <TextField
                    label="School / University"
                    value={ed.school}
                    onChange={(v) => patchItem("education", i, { school: v })}
                  />
                  <TextField
                    label="Start year"
                    value={ed.start}
                    onChange={(v) => patchItem("education", i, { start: v })}
                  />
                  <TextField
                    label="End year"
                    value={ed.end}
                    onChange={(v) => patchItem("education", i, { end: v })}
                  />
                </div>
                <TextField
                  label="Details (optional)"
                  value={ed.details ?? ""}
                  onChange={(v) => patchItem("education", i, { details: v })}
                />
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("education")}>Add education</AddButton>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            {data.skills.map((s, i) => (
              <ItemCard
                key={`${rev}-skill-${i}`}
                title={s.group || `Skill group ${i + 1}`}
                onRemove={() => removeItem("skills", i)}
                onUp={() => moveItem("skills", i, -1)}
                onDown={() => moveItem("skills", i, 1)}
              >
                <TextField
                  label="Group name"
                  value={s.group}
                  onChange={(v) => patchItem("skills", i, { group: v })}
                  placeholder="Frontend"
                />
                <Field label="Skills (comma se alag karein)">
                  <input
                    defaultValue={s.items.join(", ")}
                    onChange={(e) => patchItem("skills", i, { items: commas(e.target.value) })}
                    placeholder="React, Next.js, Tailwind CSS"
                    className={inputCls}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("skills")}>Add skill group</AddButton>
          </Section>

          {/* Projects */}
          <Section title="Projects">
            {data.projects.map((p, i) => (
              <ItemCard
                key={`${rev}-proj-${i}`}
                title={p.name || `Project ${i + 1}`}
                onRemove={() => removeItem("projects", i)}
                onUp={() => moveItem("projects", i, -1)}
                onDown={() => moveItem("projects", i, 1)}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField
                    label="Project name"
                    value={p.name}
                    onChange={(v) => patchItem("projects", i, { name: v })}
                  />
                  <TextField
                    label="Link (optional)"
                    value={p.link ?? ""}
                    onChange={(v) => patchItem("projects", i, { link: v })}
                  />
                </div>
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={p.description}
                    onChange={(e) => patchItem("projects", i, { description: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Tech used (comma se alag karein)">
                  <input
                    defaultValue={(p.tech ?? []).join(", ")}
                    onChange={(e) => patchItem("projects", i, { tech: commas(e.target.value) })}
                    placeholder="React, Node.js, MySQL"
                    className={inputCls}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton onClick={() => addItem("projects")}>Add project</AddButton>
          </Section>
        </div>

        {/* ================= PREVIEW (dark gray backdrop, CV white) ================= */}
        <div
          ref={previewRef}
          className={`preview-panel builder-scroll overflow-auto border-l border-neutral-800 bg-neutral-800 p-4 lg:col-span-2 ${
            tab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex justify-center">
            <div className="preview-zoom" style={{ zoom }}>
              <ResumePreview data={previewData} template={template} accent={accent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
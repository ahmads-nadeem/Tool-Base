"use client";

import { useState } from "react";

/* ---------- Config: apni API ke hisaab se badlen ---------- */
const API_BASE = process.env.NEXT_PUBLIC_FAST_API ?? "";
const ENDPOINTS = {
  page: `${API_BASE}/seo/audit`, // single page audit
  site: `${API_BASE}/api/seo/site`, // full website audit
};

/* ---------- Types ---------- */
type Mode = "page" | "site";
type Level = "pass" | "warn" | "fail";

type Audit = {
  url?: string;
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDes?: string;
  og_url?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_desc?: string;
  twitter_image?: string;
  h1?: string[];
  h2?: string[];
};

type Check = { label: string; level: Level; note: string };

/* ---------- Checks ---------- */
function runChecks(a: Audit): Check[] {
  const checks: Check[] = [];
  const t = a.title?.trim() ?? "";
  const d = a.description?.trim() ?? "";
  const h1 = a.h1 ?? [];

  checks.push(
    !t
      ? { label: "Title", level: "fail", note: "Title missing hai" }
      : t.length < 30 || t.length > 60
        ? { label: "Title", level: "warn", note: `${t.length} characters (30–60 best hain)` }
        : { label: "Title", level: "pass", note: `${t.length} characters` }
  );

  checks.push(
    !d
      ? { label: "Meta description", level: "fail", note: "Description missing hai" }
      : d.length < 70 || d.length > 160
        ? { label: "Meta description", level: "warn", note: `${d.length} characters (70–160 best hain)` }
        : { label: "Meta description", level: "pass", note: `${d.length} characters` }
  );

  checks.push(
    h1.length === 1
      ? { label: "H1", level: "pass", note: "Only one H1 Heading (Recommended)" }
      : h1.length === 0
        ? { label: "H1", level: "fail", note: "H1 missing hai" }
        : { label: "H1", level: "warn", note: `${h1.length} H1 mile, sirf 1 hona chahiye` }
  );

  checks.push(
    (a.h2 ?? []).length > 0
      ? { label: "H2", level: "pass", note: `${a.h2!.length} headings` }
      : { label: "H2", level: "warn", note: "Koi H2 nahi mila" }
  );

  const og = [a.ogTitle, a.ogDes, a.og_image].filter(Boolean).length;
  checks.push(
    og === 3
      ? { label: "Open Graph", level: "pass", note: "Title, Description, Image all are available" }
      : og === 0
        ? { label: "Open Graph", level: "fail", note: "OG tags are missing" }
        : { label: "Open Graph", level: "warn", note: `${og} out of 3 available` }
  );

  const tw = [a.twitter_title, a.twitter_desc, a.twitter_image].filter(Boolean).length;
  checks.push(
    tw === 3
      ? { label: "Twitter card", level: "pass", note: "Title, description, image all are available" }
      : tw === 0
        ? { label: "Twitter card", level: "fail", note: "Twitter tags are missing" }
        : { label: "Twitter card", level: "warn", note: `${tw} out of 3 available` }
  );

  return checks;
}

const levelStyle: Record<Level, string> = {
  pass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  fail: "bg-red-500/10 text-red-400 border-red-500/30",
};
const levelText: Record<Level, string> = { pass: "Good", warn: "Improve", fail: "Missing" };

/* Full-site response ko pages ki list mein convert karta hai (alag shapes handle karta hai) */
function normalizePages(data: unknown): Audit[] {
  if (Array.isArray(data)) return data as Audit[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.pages)) return obj.pages as Audit[];
    if (Array.isArray(obj.results)) return obj.results as Audit[];
    return Object.entries(obj)
      .filter(([, v]) => v && typeof v === "object")
      .map(([k, v]) => ({ url: k, ...(v as Audit) }));
  }
  return [];
}

/* ---------- Small UI pieces ---------- */
function Badge({ level }: { level: Level }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${levelStyle[level]}`}>
      {levelText[level]}
    </span>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1 border-b border-white/5 py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="break-words text-sm text-neutral-200">
        {value || <span className="text-red-400">Missing</span>}
      </dd>
    </div>
  );
}

function HeadingList({ label, items }: { label: string; items?: string[] }) {
  return (
    <div className="py-3">
      <p className="mb-2 text-sm text-neutral-500">
        {label} ({items?.length ?? 0})
      </p>
      {items?.length ? (
        <ul className="space-y-1.5 text-sm text-neutral-200">
          {items.map((h, i) => (
            <li key={i} className="rounded-lg bg-black/40 px-3 py-2">
              {h}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-red-400">Koi {label} nahi mila</p>
      )}
    </div>
  );
}

function PageReport({ audit }: { audit: Audit }) {
  const checks = runChecks(audit);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-white">{c.label}</span>
              <Badge level={c.level} />
            </div>
            <p className="text-sm text-neutral-400">{c.note}</p>
          </div>
        ))}
      </div>

      <dl>
        <Field label="Title" value={audit.title} />
        <Field label="Description" value={audit.description} />
        <Field label="OG title" value={audit.ogTitle} />
        <Field label="OG description" value={audit.ogDes} />
        <Field label="OG URL" value={audit.og_url} />
        <Field label="OG image" value={audit.og_image} />
        <Field label="Twitter title" value={audit.twitter_title} />
        <Field label="Twitter description" value={audit.twitter_desc} />
        <Field label="Twitter image" value={audit.twitter_image} />
      </dl>

      <div className="grid gap-4 md:grid-cols-2">
        <HeadingList label="H1" items={audit.h1} />
        <HeadingList label="H2" items={audit.h2} />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function SeoAuditPage() {
  const [mode, setMode] = useState<Mode>("page");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState<unknown>(null);
  const [resultMode, setResultMode] = useState<Mode>("page");
  const [copied, setCopied] = useState(false);

  async function handleAudit() {
    const target = url.trim();
    if (!target) return setError("URL is must");
    if (!/^https?:\/\//i.test(target)) return setError("URL must be start from http:// or https://");

    setLoading(true);
    setError("");
    setRaw(null);
    try {
      console.log(ENDPOINTS[mode]);
      
      const res = await fetch(ENDPOINTS[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_field: target }),
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      setRaw(await res.json());
      setResultMode(mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "There is something wrong, try Again Please.");
    } finally {
      setLoading(false);
    }
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(raw, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `seo-audit-${resultMode}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const pages = resultMode === "site" && raw ? normalizePages(raw) : [];
  const siteSummary = pages.reduce(
    (acc, p) => {
      for (const c of runChecks(p)) acc[c.level]++;
      return acc;
    },
    { pass: 0, warn: 0, fail: 0 } as Record<Level, number>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">SEO audit</h1>
          <p className="mt-3 text-lg text-neutral-400">
            Check titles, meta tags, and headings so your pages can be easily found in search.
          </p>
        </header>

        {/* Input card */}
        <section className="rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-8">
          <div
            role="tablist"
            aria-label="Audit type"
            className="mb-6 inline-flex rounded-xl border border-white/10 bg-black p-1"
          >
            {(
              [
                ["page", "Single page"],
                ["site", "Full website"],
              ] as [Mode, string][]
            ).map(([m, label]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${mode === m ? "bg-[#e60012] text-white" : "text-neutral-400 hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mb-4 text-sm text-neutral-400">
            {mode === "page"
              ? "Audit only a specific URL"
              : "Auditing all pages of the entire website by providing a URL may take longer."}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="url_field"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleAudit()}
              placeholder="https://example.com"
              // aria-label="Website URL"
              className="h-14 flex-1 rounded-full border border-white/10 bg-[#0a0a0b] px-6 text-white placeholder:text-neutral-500 focus:border-[#e60012] focus:outline-none"
            />
            <button
              onClick={handleAudit}
              disabled={loading}
              className="cursor-pointer h-14 rounded-xl bg-[#e60012] px-8 font-semibold text-white transition hover:bg-[#ff1a2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Auditing..." : mode === "page" ? "Audit page" : "Audit website"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex items-center gap-3 text-neutral-400" aria-live="polite">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-[#e60012]" />
            {mode === "site" ? "Website audit is in process..." : "Page audit is in process..."}
          </div>
        )}

        {/* Results */}
        {raw !== null && !loading && (
          <section className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">
                {resultMode === "page" ? "Page report" : `Website report (${pages.length} pages)`}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyJson}
                  className="rounded-lg border border-white/10 bg-[#141414] px-4 py-2 text-sm hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  {copied ? "Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={downloadJson}
                  className="rounded-lg bg-[#e60012] px-4 py-2 text-sm font-medium hover:bg-[#ff1a2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Download
                </button>
              </div>
            </div>

            {resultMode === "page" ? (
              <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-8">
                <PageReport audit={raw as Audit} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {(["pass", "warn", "fail"] as Level[]).map((l) => (
                    <div key={l} className="rounded-xl border border-white/10 bg-[#141414] p-4">
                      <p className="text-3xl font-bold">{siteSummary[l]}</p>
                      <p className="text-sm text-neutral-400">
                        {l === "pass" ? "Checks passed" : l === "warn" ? "Need improvement" : "Missing"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {pages.length === 0 && (
                    <p className="text-neutral-400">Koi page nahi mila. API response check karen.</p>
                  )}
                  {pages.map((p, i) => {
                    const checks = runChecks(p);
                    const bad = checks.filter((c) => c.level !== "pass").length;
                    return (
                      <details
                        key={p.url ?? p.og_url ?? i}
                        className="group rounded-2xl border border-white/10 bg-[#141414] open:border-white/20"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">{p.title || "Untitled page"}</p>
                            <p className="truncate text-sm text-neutral-500">{p.url ?? p.og_url ?? "URL nahi mila"}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${bad === 0 ? levelStyle.pass : bad > 2 ? levelStyle.fail : levelStyle.warn
                              }`}
                          >
                            {bad === 0 ? "All good" : `${bad} issues`}
                          </span>
                        </summary>
                        <div className="border-t border-white/10 p-5 sm:p-6">
                          <PageReport audit={p} />
                        </div>
                      </details>
                    );
                  })}
                </div>
              </>
            )}

            <details className="rounded-2xl border border-white/10 bg-[#141414]">
              <summary className="cursor-pointer p-5 text-sm text-neutral-400 hover:text-white">Raw JSON</summary>
              <pre className="max-h-96 overflow-auto border-t border-white/10 p-5 text-xs leading-relaxed text-emerald-300">
                {JSON.stringify(raw, null, 2)}
              </pre>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
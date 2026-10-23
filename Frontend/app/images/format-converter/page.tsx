"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  UploadCloud,
  Download,
  Loader2,
  X,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Archive,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_FAST_API;
const CONVERT_ENDPOINT = `${API_URL}/image/convert`;

const FORMATS = ["webp", "png", "jpeg", "jpg", "avif", "bmp", "tiff"] as const;
type Format = (typeof FORMATS)[number];

const MAX_FILES = 20;
const MAX_FILE_MB = 15;
const CONCURRENCY = 3;

type Status = "pending" | "converting" | "done" | "error";

type Item = {
  id: string;
  file: File;
  preview: string;
  status: Status;
  error?: string;
  result?: { url: string; blob: Blob; size: number; name: string };
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function FormatConverterPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<Format>("webp");
  const [running, setRunning] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => {
        URL.revokeObjectURL(i.preview);
        if (i.result) URL.revokeObjectURL(i.result.url);
      });
    };
  }, []);

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const addFiles = (list: FileList | File[] | null | undefined) => {
    if (!list) return;
    const problems: string[] = [];
    const fresh: Item[] = [];
    let slots = MAX_FILES - items.length;

    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) {
        problems.push(`${f.name}: image nahi hai`);
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        problems.push(`${f.name}: ${MAX_FILE_MB}MB se bari hai`);
        continue;
      }
      if (slots <= 0) {
        problems.push(`${f.name}: max ${MAX_FILES} images allowed`);
        continue;
      }
      slots--;
      fresh.push({
        id: crypto.randomUUID(),
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending",
      });
    }

    setNotice(problems.length ? problems.join(" • ") : null);
    if (fresh.length) setItems((prev) => [...prev, ...fresh]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.preview);
      if (item.result) URL.revokeObjectURL(item.result.url);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    items.forEach((i) => {
      URL.revokeObjectURL(i.preview);
      if (i.result) URL.revokeObjectURL(i.result.url);
    });
    setItems([]);
    setNotice(null);
  };

  const changeFormat = (f: Format) => {
    if (f === format) return;
    setFormat(f);
    setItems((prev) =>
      prev.map((i) => {
        if (i.result) URL.revokeObjectURL(i.result.url);
        return { ...i, status: "pending", result: undefined, error: undefined };
      })
    );
  };

  const convertOne = async (item: Item, fmt: Format) => {
    updateItem(item.id, { status: "converting", error: undefined });
    try {
      const body = new FormData();
      body.append("file", item.file);
      body.append("target_format", fmt);

      const res = await fetch(CONVERT_ENDPOINT, { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? `Server error (${res.status})`);
      }

      const blob = await res.blob();
      const base = item.file.name.replace(/\.[^/.]+$/, "");
      updateItem(item.id, {
        status: "done",
        result: {
          blob,
          url: URL.createObjectURL(blob),
          size: blob.size,
          name: `${base}.${fmt}`,
        },
      });
    } catch (e) {
      updateItem(item.id, {
        status: "error",
        error: e instanceof Error ? e.message : "Conversion fail ho gayi.",
      });
    }
  };

  const convertAll = async () => {
    const queue = items.filter((i) => i.status === "pending" || i.status === "error");
    if (!queue.length) return;

    setRunning(true);
    setNotice(null);
    const fmt = format;
    let next = 0;

    const worker = async () => {
      while (next < queue.length) {
        const item = queue[next++];
        await convertOne(item, fmt);
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker)
    );
    setRunning(false);
  };

  const downloadZip = async () => {
    const done = items.filter((i) => i.result);
    if (!done.length) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const used = new Map<string, number>();

      done.forEach((i) => {
        let name = i.result!.name;
        const count = used.get(name) ?? 0;
        used.set(name, count + 1);
        if (count > 0) {
          const dot = name.lastIndexOf(".");
          name = `${name.slice(0, dot)} (${count})${name.slice(dot)}`;
        }
        zip.file(name, i.result!.blob);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-${format}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  const doneCount = items.filter((i) => i.status === "done").length;
  const errorCount = items.filter((i) => i.status === "error").length;
  const toConvert = items.filter((i) => i.status === "pending" || i.status === "error").length;
  const totalOriginal = items.reduce((s, i) => s + i.file.size, 0);
  const totalConverted = items.reduce((s, i) => s + (i.result?.size ?? 0), 0);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-10 py-12">
      <div className="mx-auto max-w-350">
        <Link
          href="/images"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-red-500"
        >
          <ChevronLeft size={16} /> Image Tools
        </Link>

        <h1 className="mt-4 text-5xl font-bold text-white">
          Format <span className="text-red-600">Converter</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          Upload one or more images, select the format, and convert them all with a single click.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="h-fit rounded-2xl border border-neutral-800 bg-[#0d0d10] p-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-red-900/60 bg-red-950/40 text-red-500">
              <ArrowRightLeft size={26} strokeWidth={1.8} />
            </div>

            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`mt-7 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragging
                  ? "border-red-500 bg-red-950/30"
                  : "border-neutral-700 hover:border-red-600/60 hover:bg-[#120a0c]"
              }`}
            >
              <UploadCloud className="text-red-500" size={36} strokeWidth={1.6} />
              <p className="mt-3 text-base font-medium text-white">
                Drop images here or click
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Max {MAX_FILES} images • {MAX_FILE_MB}MB each
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            <label className="mt-6 block text-sm font-medium text-neutral-300">
              Convert all to
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => changeFormat(f)}
                  disabled={running}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase transition disabled:opacity-50 ${
                    format === f
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-neutral-700 bg-black/40 text-neutral-300 hover:border-red-600/60 hover:text-red-500"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {notice && (
              <p className="mt-5 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                {notice}
              </p>
            )}

            <button
              onClick={convertAll}
              disabled={!toConvert || running}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {running ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Converting...
                </>
              ) : (
                <>
                  Convert {toConvert || ""} {toConvert === 1 ? "image" : "images"} to{" "}
                  {format.toUpperCase()}
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-neutral-800 bg-[#0d0d10] p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Files {items.length > 0 && <span className="text-neutral-500">({items.length})</span>}
                </h2>
                {items.length > 0 && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {doneCount} done
                    {errorCount > 0 && <span className="text-red-400"> {errorCount} failed</span>}
                    {doneCount > 0 && (
                      <>
                        {" "}• {formatSize(totalOriginal)} → {formatSize(totalConverted)}
                      </>
                    )}
                  </p>
                )}
              </div>

              {items.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={downloadZip}
                    disabled={!doneCount || zipping}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {zipping ? <Loader2 size={16} className="animate-spin" /> : <Archive size={16} />}
                    Download all (ZIP)
                  </button>
                  <button
                    onClick={clearAll}
                    disabled={running}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-red-600/60 hover:text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={16} /> Clear
                  </button>
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-800 py-24 text-center text-neutral-500">
                No image selected yet.
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {items.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-black/40 p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={i.result?.url ?? i.preview}
                      alt={i.file.name}
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{i.file.name}</p>
                      <p className="text-xs text-neutral-500">
                        {formatSize(i.file.size)}
                        {i.result && (
                          <span className="text-neutral-300">
                            {" "}→ {formatSize(i.result.size)} ({i.result.name.split(".").pop()?.toUpperCase()})
                          </span>
                        )}
                      </p>
                      {i.status === "error" && (
                        <p className="mt-1 truncate text-xs text-red-400">{i.error}</p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {i.status === "pending" && (
                        <span className="text-xs text-neutral-500">Ready</span>
                      )}
                      {i.status === "converting" && (
                        <Loader2 size={18} className="animate-spin text-red-500" />
                      )}
                      {i.status === "done" && i.result && (
                        <>
                          <CheckCircle2 size={18} className="text-green-500" />
                          <a
                            href={i.result.url}
                            download={i.result.name}
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-950/40"
                            aria-label="Download"
                          >
                            <Download size={18} />
                          </a>
                        </>
                      )}
                      {i.status === "error" && (
                        <AlertCircle size={18} className="text-red-500" />
                      )}
                      <button
                        onClick={() => removeItem(i.id)}
                        disabled={i.status === "converting"}
                        className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-950/40 hover:text-red-500 disabled:opacity-30"
                        aria-label="Remove"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
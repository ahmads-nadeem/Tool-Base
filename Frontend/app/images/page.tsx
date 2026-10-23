import Link from "next/link";
import { ArrowRightLeft, ImageDown, ChevronRight, type LucideIcon } from "lucide-react";

type ImageTool = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const imageTools: ImageTool[] = [
  {
    title: "Format Converter",
    description: "Convert images between JPG, PNG, WebP aur AVIF formats.",
    href: "/images/format-converter",
    icon: ArrowRightLeft,
  },
  {
    title: "Image Compressor",
    description: "Image ka size kam karo quality kharab kiye baghair.",
    href: "/images/image-compressor",
    icon: ImageDown,
  },
];

export const metadata = {
  title: "Image Tools | SUDO",
  description: "Image converter aur compressor — sab image tools ek jagah.",
};

export default function Images() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-10 py-12">
      <div className="mx-auto max-w-350">
        {/* Heading */}
        <h1 className="text-5xl font-bold text-white">
          Image <span className="text-red-600">Tools</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          Sab image tools ek jagah — convert, compress aur optimize ke liye.
        </p>

        {/* Cards grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {imageTools.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-neutral-800 bg-[#0d0d10] p-7 transition hover:border-red-600/60 hover:bg-[#120a0c]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-red-900/60 bg-red-950/40 text-red-500">
                <Icon size={26} strokeWidth={1.8} />
              </div>

              <h2 className="mt-7 text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 flex-1 text-base leading-relaxed text-neutral-400">
                {description}
              </p>

              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-red-500 transition group-hover:gap-2">
                Open Tool <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
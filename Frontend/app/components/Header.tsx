"use client"
import Link from 'next/link'
import { useState } from "react";

const navItems = [
{
  page: "Resume Generator",
  link: '/resume-generator'
},
{
  page: "SEO",
  link: "/seo"
},
{
  page: "Images",
  link: '#'
},
{
  page: "Files",
  link: '#'
},
{
  page: "Barcode",
  link: '#'
}
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header suppressHydrationWarning className="bg-black border-b border-red-600/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <figure className="flex items-center m-0 cursor-pointer">
            <img
              width={60}
              height={40}
              src="/logo.webp"
              alt="Logo"
              className="object-contain"
              // w-10 h-10
            />
            <span className='font-bold text-2xl'>SUDO</span>
          </figure>
          

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 list-none m-0 p-0">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="text-[15px] text-white/80 font-medium text-sm tracking-wide transition-all duration-200 hover:font-bold hover:text-red-500"
                  >
                    {item.page}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <nav className="md:hidden pb-4">
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="block px-2 py-2 rounded-md text-white/80 font-medium text-sm hover:bg-red-600/10 hover:text-red-500 transition-colors duration-200"
                  >
                    {item.page}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
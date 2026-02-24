"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/states/", label: "States" },
  { href: "/providers/", label: "Providers" },
  { href: "/procedures/", label: "Procedures" },
  { href: "/about/", label: "About" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation (e.g., browser back/forward)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold text-gray-900 dark:text-gray-100 sm:text-lg"
        >
          {SITE_NAME}
        </Link>

        {/* Desktop: search + nav + theme */}
        <div className="hidden items-center gap-4 sm:flex">
          <GlobalSearch />
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  pathname?.startsWith(href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "hover:text-gray-900 dark:hover:text-gray-100"
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile: search icon + theme + hamburger */}
        <div className="flex items-center gap-1 sm:hidden">
          <GlobalSearch />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-950 sm:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                pathname?.startsWith(href)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

import Link from "next/link";
import { DATA_SOURCE, DATA_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:justify-between">
          <div>
            <p>
              Data source:{" "}
              <a
                href={DATA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {DATA_SOURCE}
              </a>
            </p>
            <p className="mt-1">
              227M rows of Medicaid provider spending, 2018-2024. Updated
              annually by HHS.
            </p>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/about/"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              About
            </Link>
            <Link
              href="/states/"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              States
            </Link>
            <Link
              href="/providers/"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              Providers
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { DATA_SOURCE, DATA_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>
            Data source:{" "}
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {DATA_SOURCE}
            </a>
          </p>
          <p className="mt-1">
            227M rows of Medicaid provider spending, 2018-2024. Updated annually
            by HHS.
          </p>
        </div>
      </div>
    </footer>
  );
}

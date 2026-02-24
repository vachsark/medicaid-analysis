import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-2 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-gray-900 dark:text-gray-100"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

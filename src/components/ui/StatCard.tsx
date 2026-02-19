interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white px-4 py-3 sm:p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:mt-1 sm:text-3xl">
        {value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:mt-1 sm:text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

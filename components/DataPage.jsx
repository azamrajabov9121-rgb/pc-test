"use client";

import Icon from "@/components/Icon";
import { useCachedFetch } from "@/lib/cache";

function Skeleton({ rows = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl bg-zinc-200/70"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Har bir bo'lim uchun umumiy qobiq: sarlavha, kesh belgisi, yuklanish, xatolik.
 * `children` — render funksiyasi: (data) => JSX
 */
export default function DataPage({
  cacheKey,
  url,
  title,
  description,
  children,
}) {
  const { data, loading, error, fromCache, refresh } = useCachedFetch(
    cacheKey,
    url,
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
          <code className="mt-2 inline-block rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
            GET {url}
          </code>
        </div>

        <div className="flex items-center gap-2">
          {!loading && !error && (
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                fromCache
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {fromCache
                ? "Keshdan olindi — so'rov ketmadi"
                : "Backenddan yuklandi"}
            </span>
          )}
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <Icon name="refresh" className="size-3.5" />
            Yangilash
          </button>
        </div>
      </header>

      {loading && <Skeleton />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Ma&apos;lumot yuklanmadi</p>
          <p className="mt-1 text-red-600">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {!loading && !error && data && children(data)}
    </div>
  );
}

/* --- sahifalarda qayta ishlatiladigan mayda bo'laklar --- */

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "zinc" }) {
  const tones = {
    zinc: "bg-zinc-100 text-zinc-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

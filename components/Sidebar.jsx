"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Icon from "@/components/Icon";
import { MENU } from "@/lib/menu";
import { clearCache, useCacheStats } from "@/lib/cache";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { networkRequests, cachedKeys } = useCacheStats();

  return (
    <>
      {/* Mobil uchun ochish tugmasi */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-zinc-300 bg-white p-2 shadow-sm lg:hidden"
        aria-label="Menyuni ochish"
      >
        <span className="block h-0.5 w-5 bg-zinc-800" />
        <span className="mt-1 block h-0.5 w-5 bg-zinc-800" />
        <span className="mt-1 block h-0.5 w-5 bg-zinc-800" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-zinc-900 text-zinc-300 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-500 text-white">
            <Icon name="bolt" className="size-4" />
          </span>
          <span className="font-semibold text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {MENU.map((item) => {
            const active = pathname === item.href;
            const cached = item.cacheKey && cachedKeys.includes(item.cacheKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={item.icon} />
                <span className="flex-1">{item.label}</span>
                {cached && (
                  <span
                    title="Bu bo'lim keshlangan — qayta so'rov ketmaydi"
                    className={`size-1.5 rounded-full ${
                      active ? "bg-white" : "bg-emerald-400"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs">
          <div className="mb-2 flex items-center gap-2 text-zinc-400">
            <Icon name="database" className="size-4" />
            <span>Kesh holati</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-500">Tarmoq so&apos;rovlari</span>
            <span className="font-mono text-white">{networkRequests}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-500">Keshlangan bo&apos;limlar</span>
            <span className="font-mono text-emerald-400">
              {cachedKeys.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => clearCache()}
            className="mt-3 w-full rounded-md border border-white/10 px-2 py-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            Keshni tozalash
          </button>
        </div>
      </aside>
    </>
  );
}

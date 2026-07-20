"use client";

import Link from "next/link";

import Icon from "@/components/Icon";
import { Card } from "@/components/DataPage";
import { MENU } from "@/lib/menu";
import { useCachedFetch, useCacheStats } from "@/lib/cache";

function Stat({ label, value, loading, tone }) {
  return (
    <Card>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-zinc-200" />
      ) : (
        <p className={`mt-1 text-3xl font-semibold ${tone}`}>{value}</p>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  // Diqqat: bu yerda ham, /users sahifasida ham bir xil kesh kaliti ishlatiladi.
  // Shuning uchun panelda bir marta yuklangan ma'lumot /users da qayta so'ralmaydi.
  const users = useCachedFetch("users", "https://jsonplaceholder.typicode.com/users");
  const products = useCachedFetch("products", "https://dummyjson.com/products?limit=30");
  const { networkRequests, cachedKeys } = useCacheStats();

  const productList = products.data?.products ?? [];
  const avgPrice = productList.length
    ? (
        productList.reduce((sum, p) => sum + p.price, 0) / productList.length
      ).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Boshqaruv paneli
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Umumiy ko&apos;rsatkichlar. Ma&apos;lumotlar bepul ochiq API&apos;lardan
          olinadi va brauzer xotirasida keshlanadi.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Foydalanuvchilar"
          value={users.data?.length ?? 0}
          loading={users.loading}
          tone="text-zinc-900"
        />
        <Stat
          label="Mahsulotlar"
          value={products.data?.total ?? 0}
          loading={products.loading}
          tone="text-zinc-900"
        />
        <Stat
          label="O'rtacha narx"
          value={`$${avgPrice}`}
          loading={products.loading}
          tone="text-zinc-900"
        />
        <Stat
          label="Tarmoq so'rovlari"
          value={networkRequests}
          loading={false}
          tone="text-indigo-600"
        />
      </div>

      <Card className="border-indigo-200 bg-indigo-50/50">
        <div className="flex gap-3">
          <Icon name="database" className="mt-0.5 size-5 text-indigo-600" />
          <div className="text-sm">
            <p className="font-medium text-indigo-900">Kesh qanday ishlaydi</p>
            <p className="mt-1 text-indigo-800/80">
              Har bir bo&apos;limga <strong>birinchi marta</strong> kirilganda
              backendga so&apos;rov ketadi va natija xotiraga yoziladi. Boshqa
              bo&apos;limga o&apos;tib qaytib kelsangiz, so&apos;rov{" "}
              <strong>umuman ketmaydi</strong> — yuqoridagi &quot;Tarmoq
              so&apos;rovlari&quot; soni o&apos;zgarmasligiga e&apos;tibor bering.
              Majburiy yangilash uchun sahifadagi &quot;Yangilash&quot; tugmasini
              bosing.
            </p>
            <p className="mt-2 font-mono text-xs text-indigo-700">
              Keshlangan: {cachedKeys.length ? cachedKeys.join(", ") : "—"}
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">
          Bo&apos;limlar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.filter((m) => m.cacheKey).map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                    <Icon name={item.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.label}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {new URL(item.api).hostname}
                    </p>
                  </div>
                  {cachedKeys.includes(item.cacheKey) && (
                    <span className="ml-auto shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      keshda
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

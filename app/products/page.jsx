"use client";

import Image from "next/image";

import DataPage, { Badge, Card } from "@/components/DataPage";

export default function ProductsPage() {
  return (
    <DataPage
      cacheKey="products"
      url="https://dummyjson.com/products?limit=30"
      title="Mahsulotlar"
      description="DummyJSON ochiq API'sidagi mahsulotlar katalogi."
    >
      {(data) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <div className="relative mb-3 h-36 overflow-hidden rounded-lg bg-zinc-100">
                <Image
                  src={p.thumbnail}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-contain p-2"
                />
              </div>
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-zinc-900">{p.title}</h3>
                <span className="shrink-0 font-semibold text-zinc-900">
                  ${p.price}
                </span>
              </div>
              <p className="mb-3 line-clamp-2 text-xs text-zinc-500">
                {p.description}
              </p>
              <div className="mt-auto flex items-center gap-2">
                <Badge tone="indigo">{p.category}</Badge>
                <Badge tone={p.stock > 20 ? "green" : "amber"}>
                  {p.stock} dona
                </Badge>
                <span className="ml-auto text-xs text-amber-600">
                  ★ {p.rating}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DataPage>
  );
}

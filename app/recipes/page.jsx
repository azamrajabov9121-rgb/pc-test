"use client";

import Image from "next/image";

import DataPage, { Badge, Card } from "@/components/DataPage";

export default function RecipesPage() {
  return (
    <DataPage
      cacheKey="recipes"
      url="https://dummyjson.com/recipes?limit=20"
      title="Retseptlar"
      description="Taomlar retseptlari (DummyJSON ochiq API)."
    >
      {(data) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.recipes.map((r) => (
            <Card key={r.id} className="flex flex-col overflow-hidden !p-0">
              <div className="relative h-40 bg-zinc-100">
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {r.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {r.cuisine} · {r.difficulty} · {r.caloriesPerServing} kcal
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.mealType?.map((m) => (
                    <Badge key={m} tone="indigo">
                      {m}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between pt-3 text-xs text-zinc-500">
                  <span>
                    ⏱ {r.prepTimeMinutes + r.cookTimeMinutes} daq · {r.servings}{" "}
                    porsiya
                  </span>
                  <span className="text-amber-600">★ {r.rating}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DataPage>
  );
}

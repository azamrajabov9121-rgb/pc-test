"use client";

import DataPage, { Badge, Card } from "@/components/DataPage";

export default function TodosPage() {
  return (
    <DataPage
      cacheKey="todos"
      url="https://dummyjson.com/todos?limit=30"
      title="Vazifalar"
      description="Bajarilgan va kutilayotgan vazifalar ro'yxati (DummyJSON)."
    >
      {(data) => {
        const done = data.todos.filter((t) => t.completed).length;

        return (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <p className="text-xs text-zinc-500">Jami</p>
                <p className="mt-1 text-2xl font-semibold">
                  {data.todos.length}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-zinc-500">Bajarilgan</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600">
                  {done}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-zinc-500">Kutilmoqda</p>
                <p className="mt-1 text-2xl font-semibold text-amber-600">
                  {data.todos.length - done}
                </p>
              </Card>
            </div>

            <div className="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              {data.todos.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded border text-xs ${
                      t.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300"
                    }`}
                  >
                    {t.completed ? "✓" : ""}
                  </span>
                  <span
                    className={`flex-1 text-sm ${
                      t.completed
                        ? "text-zinc-400 line-through"
                        : "text-zinc-800"
                    }`}
                  >
                    {t.todo}
                  </span>
                  <Badge tone={t.completed ? "green" : "amber"}>
                    {t.completed ? "bajarildi" : "kutilmoqda"}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        );
      }}
    </DataPage>
  );
}

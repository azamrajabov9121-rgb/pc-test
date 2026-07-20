"use client";

import DataPage, { Card } from "@/components/DataPage";

export default function CommentsPage() {
  return (
    <DataPage
      cacheKey="comments"
      url="https://dummyjson.com/comments?limit=30"
      title="Izohlar"
      description="USERS qoldirgan izohlar (DummyJSON)."
    >
      {(data) => (
        <div className="space-y-3">
          {data.comments.map((c) => (
            <Card key={c.id} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {c.user.username.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-zinc-900">
                    {c.user.fullName ?? c.user.username}
                  </span>
                  <span className="text-xs text-zinc-500">
                    @{c.user.username}
                  </span>
                  <span className="ml-auto text-xs text-zinc-400">
                    post #{c.postId}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">{c.body}</p>
                <p className="mt-1.5 text-xs text-zinc-400">👍 {c.likes}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DataPage>
  );
}

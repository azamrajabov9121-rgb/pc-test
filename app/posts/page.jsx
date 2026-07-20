"use client";

import DataPage, { Badge, Card } from "@/components/DataPage";

export default function PostsPage() {
  return (
    <DataPage
      cacheKey="posts"
      url="https://dummyjson.com/posts?limit=30"
      title="Postlar"
      description="DummyJSON ochiq API'sidan olingan maqolalar."
    >
      {(data) => (
        <div className="grid gap-4 md:grid-cols-2">
          {data.posts.map((post) => (
            <Card key={post.id}>
              <h3 className="text-sm font-semibold text-zinc-900">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                {post.body}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {post.tags?.map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
                <span className="ml-auto text-xs text-zinc-500">
                  👍 {post.reactions?.likes ?? 0} · 👀 {post.views ?? 0}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DataPage>
  );
}

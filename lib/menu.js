/** Yon paneldagi 7 ta bo'lim. Har biri o'z bepul (kalitsiz) backendidan ma'lumot oladi. */
export const MENU = [
  {
    href: "/",
    label: "Boshqaruv paneli",
    icon: "grid",
    cacheKey: null,
  },
  {
    href: "/users",
    label: "USERS",
    icon: "users",
    cacheKey: "users",
    api: "https://jsonplaceholder.typicode.com/users",
  },
  {
    href: "/products",
    label: "Mahsulotlar",
    icon: "box",
    cacheKey: "products",
    api: "https://dummyjson.com/products?limit=30",
  },
  {
    href: "/posts",
    label: "Postlar",
    icon: "file",
    cacheKey: "posts",
    api: "https://dummyjson.com/posts?limit=30",
  },
  {
    href: "/comments",
    label: "Izohlar",
    icon: "chat",
    cacheKey: "comments",
    api: "https://dummyjson.com/comments?limit=30",
  },
  {
    href: "/todos",
    label: "Vazifalar",
    icon: "check",
    cacheKey: "todos",
    api: "https://dummyjson.com/todos?limit=30",
  },
  {
    href: "/recipes",
    label: "Retseptlar",
    icon: "chef",
    cacheKey: "recipes",
    api: "https://dummyjson.com/recipes?limit=20",
  },
];

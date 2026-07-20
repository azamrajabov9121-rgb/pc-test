"use client";

import DataPage from "@/components/DataPage";

export default function UsersPage() {
  return (
    <DataPage
      cacheKey="users"
      url="https://jsonplaceholder.typicode.com/users"
      title="Foydalanuvchilar"
      description="JSONPlaceholder ochiq API'sidan olingan ro'yxat."
    >
      {(users) => (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ism</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Kompaniya</th>
                <th className="px-4 py-3 font-medium">Shahar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{u.name}</div>
                    <div className="text-xs text-zinc-500">@{u.username}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.phone}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.company.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

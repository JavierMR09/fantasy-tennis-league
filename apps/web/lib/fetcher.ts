// apps/web/lib/fetcher.ts
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

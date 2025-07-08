'use client'

import { useState }       from 'react'
import { useRouter }      from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState<string|null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',            // Important: send/receive HttpOnly cookie
      body: JSON.stringify({ email, password, name })
    })

    if (res.ok) {
      router.push('/')                  // redirect on success
    } else {
      const { error: msg } = await res.json()
      setError(msg)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            className="mt-1 block w-full border px-2 py-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span>Name</span>
          <input
            type="text"
            className="mt-1 block w-full border px-2 py-1"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span>Password</span>
          <input
            type="password"
            className="mt-1 block w-full border px-2 py-1"
            value={password}
            onChange={e => setPass(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

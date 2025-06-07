'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    })

    console.log('Response status:', res)

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('Registered successfully!')
    setTimeout(() => setMessage(''), 3000)

    } else {
      setMessage(data.error)
    setTimeout(() => setMessage(''), 3000)

    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  )
}

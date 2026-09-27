'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'

export function CodesSearch() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const code = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (!code) return
    router.push(`/codes/${code}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <label htmlFor="obd-code" className="sr-only">
        OBD-II code
      </label>
      <input
        id="obd-code"
        name="code"
        inputMode="text"
        autoComplete="off"
        placeholder="e.g. P0300"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-12 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 font-mono text-base text-white placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none"
      />
      <Button type="submit" variant="primary" size="lg" className="h-12 px-5">
        Look up
      </Button>
    </form>
  )
}

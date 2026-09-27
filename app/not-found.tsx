import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-20">
      <p className="font-mono text-sm text-orange-500">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-zinc-400">
        That code, light, or guide is not here. Try search from the home tools.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="md">
          <Link href="/" className="contents">
            Home
          </Link>
        </Button>
        <Button variant="outline" size="md">
          <Link href="/codes" className="contents">
            Codes
          </Link>
        </Button>
        <Button variant="outline" size="md">
          <Link href="/dash-lights" className="contents">
            Dash lights
          </Link>
        </Button>
      </div>
    </div>
  )
}

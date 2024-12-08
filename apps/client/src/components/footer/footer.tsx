import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import FabButton from '@/components/fab/fab'

export default function Footer() {
  const pathname = usePathname()
  const [user, setUser] = useState<string>("")

  useEffect(() => {
    const storedUser = localStorage.getItem('profile')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [pathname])

  return (
    <footer className="py-6 px-4 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Anzo Benjamin
        </div>
        {user && <FabButton />}
      </div>
    </footer>
  )
}
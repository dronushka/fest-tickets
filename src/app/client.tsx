"use client"

import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import Navigation from "~/components/navigation"
import { Session } from "next-auth"

export default function Client({ session, children }: { session?: Session, children: ReactNode }) {
  return (
    <SessionProvider session={session}>
      <html lang="ru">
        <body>
          <Navigation />
          <main className="bg-neutral-100 p-2">{children}</main>
        </body>
      </html>
    </SessionProvider>
  )
}

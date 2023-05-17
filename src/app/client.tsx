"use client"

import { ReactNode } from "react"
import Navigation from "~/components/navigation"

export default function Client({ children }: { children: ReactNode }) {
  return (
    // <SuperTokensWrapper>
      <html lang="ru">
        <body>
          <Navigation />
          <main className="bg-neutral-100 p-2">{children}</main>
        </body>
      </html>
    // </SuperTokensWrapper>
  )
}

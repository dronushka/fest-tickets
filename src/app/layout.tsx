import Navigation from "~/components/navigation"
import "~/styles/globals.css"

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        {/* <!-- Main navigation container --> */}
        <Navigation />
        {/* <Sidebar /> */}
        <main className="bg-neutral-100 p-2">{children}</main>
      </body>
    </html>
  )
}

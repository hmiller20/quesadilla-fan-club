// layout files are used to define the structure of the pages

import "../globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/context/auth-context"
import ClientShell from "@/components/ClientShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Quesadilla Fan Club",
  description: "About psychology.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-green-50 text-gray-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paynelo — Get paid faster',
  description: 'Automated invoice follow-ups sent from your own Gmail. Clients never know it\'s automated.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

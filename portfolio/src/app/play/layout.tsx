// Layout for easter egg page - full screen, no padding
export default function PlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {children}
    </div>
  )
}


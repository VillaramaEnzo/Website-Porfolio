import GridOverlay  from '../dev/GridOverlay'

function ClientContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GridOverlay />
      {children}
    </>
  )
}


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientContent>
      {children}
    </ClientContent>
  )
}
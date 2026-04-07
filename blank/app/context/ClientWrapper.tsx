import GridOverlay  from '../dev/GridOverlay'
import CommandCenter from '../components/widgets/CommandCenter'

function ClientContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GridOverlay />
      <CommandCenter />
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
'use client'

import type { ReactNode } from 'react'
import GridOverlay from '../dev/GridOverlay'
import CommandCenter from '../components/widgets/CommandCenter'
import AppProviders from './AppProviders'

interface ClientWrapperProps {
  children: ReactNode
}

function ClientContent({ children }: ClientWrapperProps) {
  return (
    <>
      <GridOverlay />
      <CommandCenter />
      {children}
    </>
  )
}


export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <AppProviders>
      <ClientContent>{children}</ClientContent>
    </AppProviders>
  )
}
'use client'

import { useEffect } from 'react'

type ColorSchemeProviderProps = {
  colorScheme: string
  children: React.ReactNode
}

export function ColorSchemeProvider({ colorScheme, children }: ColorSchemeProviderProps) {
  useEffect(() => {
    const validSchemes = ['neon-acid', 'emerald', 'blue', 'orange']
    if (validSchemes.includes(colorScheme) && colorScheme !== 'neon-acid') {
      document.documentElement.dataset.colorScheme = colorScheme
    } else {
      delete document.documentElement.dataset.colorScheme
    }
  }, [colorScheme])

  return <>{children}</>
}

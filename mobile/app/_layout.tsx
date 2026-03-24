import '../global.css'
import '@/i18n'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Platform } from 'react-native'
import i18n from '@/i18n'
import { AuthProvider } from '@/lib/auth-context'
import { colors } from '@/theme/colors'

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </AuthProvider>
    </I18nextProvider>
  )
}

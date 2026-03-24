import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/theme/colors'

export default function OwnerMoreScreen() {
  const { t } = useTranslation()
  const { signOut } = useAuth()

  return (
    <View className="flex-1 p-6" style={{ backgroundColor: colors.background }}>
      <Text className="text-mutedForeground text-sm mb-6">Use the web dashboard for full settings, accounting, and plans.</Text>
      <Pressable
        onPress={async () => {
          await signOut()
          router.replace('/(auth)/login')
        }}
        className="rounded-lg py-4 items-center border"
        style={{ borderColor: colors.destructive }}
      >
        <Text style={{ color: colors.destructive, fontWeight: '600' }}>{t('signOut')}</Text>
      </Pressable>
    </View>
  )
}

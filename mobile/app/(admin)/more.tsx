import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/theme/colors'

export default function AdminMoreScreen() {
  const { t } = useTranslation()
  const { signOut } = useAuth()

  return (
    <View className="flex-1 p-6" style={{ backgroundColor: colors.background }}>
      <Text className="text-sm mb-6" style={{ color: colors.mutedForeground }}>
        Full admin tools are available on the web panel.
      </Text>
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

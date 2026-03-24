import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/theme/colors'

export default function NoProfileScreen() {
  const { t } = useTranslation()
  const { signOut } = useAuth()

  return (
    <View className="flex-1 p-6 justify-center" style={{ backgroundColor: colors.background }}>
      <Text className="text-xl font-bold text-foreground mb-3">{t('noProfileTitle')}</Text>
      <Text className="text-mutedForeground mb-8 leading-6">{t('noProfileBody')}</Text>
      <Pressable
        onPress={async () => {
          await signOut()
          router.replace('/(auth)/login')
        }}
        className="rounded-lg py-4 items-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="font-semibold uppercase" style={{ color: colors.primaryForeground }}>
          {t('backToLogin')}
        </Text>
      </Pressable>
    </View>
  )
}

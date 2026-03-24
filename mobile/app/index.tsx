import { ActivityIndicator, View } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '@/lib/auth-context'
import { colors } from '@/theme/colors'

export default function Index() {
  const { session, role, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />
  }

  if (!role) {
    return <Redirect href="/(auth)/no-profile" />
  }

  if (role === 'member') return <Redirect href="/(member)" />
  if (role === 'trainer') return <Redirect href="/(trainer)" />
  if (role === 'owner') return <Redirect href="/(owner)" />
  if (role === 'admin') return <Redirect href="/(admin)" />

  return <Redirect href="/(auth)/no-profile" />
}

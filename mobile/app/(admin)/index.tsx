import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchAdminKpis } from '@/lib/api/dashboard'
import { colors } from '@/theme/colors'

export default function AdminDashboardScreen() {
  const { t } = useTranslation()
  const [kpis, setKpis] = useState<{ gymCount: number; memberCount: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchAdminKpis()
    setKpis(data)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
    >
      <View className="rounded-xl p-4 mb-3 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Text className="text-xs uppercase" style={{ color: colors.mutedForeground }}>
          Gyms (owners)
        </Text>
        <Text className="text-3xl font-mono font-bold mt-1" style={{ color: colors.primary }}>
          {kpis?.gymCount ?? 0}
        </Text>
      </View>
      <View className="rounded-xl p-4 mb-3 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Text className="text-xs uppercase" style={{ color: colors.mutedForeground }}>
          {t('memberCount')} (all)
        </Text>
        <Text className="text-3xl font-mono font-bold mt-1" style={{ color: colors.primary }}>
          {kpis?.memberCount ?? 0}
        </Text>
      </View>
    </ScrollView>
  )
}

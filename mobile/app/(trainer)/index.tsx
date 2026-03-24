import { useCallback, useEffect, useState } from 'react'
import { View, Text, RefreshControl, ScrollView, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchTrainerAssignedMembers } from '@/lib/api/trainers'
import { colors } from '@/theme/colors'

export default function TrainerDashboardScreen() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchTrainerAssignedMembers()
    setCount(data.length)
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
      className="flex-1 p-6"
      style={{ backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
    >
      <Text className="text-xs uppercase tracking-wider mb-2" style={{ color: colors.mutedForeground }}>
        {t('assignedMembers')}
      </Text>
      <Text className="text-4xl font-mono font-bold" style={{ color: colors.primary }}>
        {count}
      </Text>
    </ScrollView>
  )
}

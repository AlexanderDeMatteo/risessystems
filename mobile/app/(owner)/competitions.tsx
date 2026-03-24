import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchOwnerCompetitions } from '@/lib/api/competitions'
import type { Competition } from '@/lib/types/competition'
import { colors } from '@/theme/colors'

export default function OwnerCompetitionsScreen() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchOwnerCompetitions()
    setItems(data)
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
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
        ListEmptyComponent={
          <Text className="text-center mt-8" style={{ color: colors.mutedForeground }}>
            {t('noCompetitions')}
          </Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="rounded-xl p-4 mb-2 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Text className="font-semibold" style={{ color: colors.foreground }}>
              {item.title}
            </Text>
            <Text className="text-xs uppercase mt-2" style={{ color: colors.mutedForeground }}>
              {item.scope} · {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

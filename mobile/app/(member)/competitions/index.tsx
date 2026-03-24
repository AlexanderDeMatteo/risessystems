import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { fetchMemberInternalCompetitions } from '@/lib/api/competitions'
import type { Competition } from '@/lib/types/competition'
import { colors } from '@/theme/colors'

export default function MemberCompetitionsScreen() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await fetchMemberInternalCompetitions()
    if (!error) setItems(data)
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
          <Text className="text-center mt-8 px-4" style={{ color: colors.mutedForeground }}>
            {t('noCompetitions')}
          </Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(member)/competitions/${item.id}`)}
            className="rounded-xl p-4 mb-3 border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <Text className="font-semibold text-lg" style={{ color: colors.foreground }}>
              {item.title}
            </Text>
            <Text className="text-sm mt-1 uppercase" style={{ color: colors.primary }}>
              {item.status}
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchTrainerAssignedMembers } from '@/lib/api/trainers'
import type { Member } from '@/lib/types/member'
import { colors } from '@/theme/colors'

export default function TrainerMembersScreen() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchTrainerAssignedMembers()
    setRows(data)
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
        data={rows}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
        ListEmptyComponent={
          <Text className="text-center mt-8 px-4" style={{ color: colors.mutedForeground }}>
            No assigned members.
          </Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="rounded-xl p-4 mb-2 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Text className="font-semibold" style={{ color: colors.foreground }}>
              {[item.first_name, item.last_name].filter(Boolean).join(' ')}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
              {item.email ?? '—'} · {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

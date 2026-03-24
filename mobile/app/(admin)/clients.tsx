import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchAdminClients } from '@/lib/api/admin'
import type { User } from '@/lib/types/user'
import { colors } from '@/theme/colors'

export default function AdminClientsScreen() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchAdminClients()
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
          <Text className="text-center mt-8" style={{ color: colors.mutedForeground }}>
            No clients.
          </Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="rounded-xl p-4 mb-2 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Text className="font-semibold" style={{ color: colors.foreground }}>
              {item.gym_name ?? item.name}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
              {item.email}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

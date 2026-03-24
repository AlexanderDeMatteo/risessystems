import { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchMyCheckIns, type CheckInRow } from '@/lib/api/check-ins'
import { colors } from '@/theme/colors'

export default function MemberCheckInsScreen() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<CheckInRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchMyCheckIns(80)
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
            {t('noCheckIns')}
          </Text>
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="rounded-xl p-4 mb-2 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Text className="font-mono text-sm" style={{ color: colors.foreground }}>
              {new Date(item.check_in_time).toLocaleString()}
            </Text>
            {item.check_out_time ? (
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                Out: {new Date(item.check_out_time).toLocaleString()}
                {item.duration_minutes != null ? ` · ${item.duration_minutes} min` : ''}
              </Text>
            ) : (
              <Text className="text-xs mt-1" style={{ color: colors.warning }}>
                Open visit
              </Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

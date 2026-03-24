import { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, TextInput, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchOwnerMembers } from '@/lib/api/members'
import type { Member } from '@/lib/types/member'
import { colors } from '@/theme/colors'

export default function OwnerMembersScreen() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [allRows, setAllRows] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchOwnerMembers()
    setAllRows(data)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const rows = useMemo(() => {
    if (!search.trim()) return allRows
    const q = search.trim().toLowerCase()
    return allRows.filter(
      (m) =>
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        (m.email?.toLowerCase().includes(q) ?? false)
    )
  }, [allRows, search])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t('searchMembers')}
        placeholderTextColor={colors.mutedForeground}
        className="mx-4 mt-4 mb-2 rounded-lg px-4 py-3 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="rounded-xl p-4 mb-2 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Text className="font-semibold" style={{ color: colors.foreground }}>
              {[item.first_name, item.last_name].filter(Boolean).join(' ')}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
              {item.email ?? '—'}
            </Text>
            <Text className="text-xs mt-2 uppercase" style={{ color: colors.primary }}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

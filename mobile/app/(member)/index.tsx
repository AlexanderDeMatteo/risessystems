import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { useTranslation } from 'react-i18next'
import { fetchMyMemberRow } from '@/lib/api/members'
import type { Member } from '@/lib/types/member'
import { colors } from '@/theme/colors'

export default function MemberHomeScreen() {
  const { t } = useTranslation()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchMyMemberRow()
    setMember(data)
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const qrPayload = member ? member.qr_code || String(member.id) : ''

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  if (!member) {
    return (
      <View className="flex-1 p-6 justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground }}>Could not load member profile.</Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 24, alignItems: 'center' }}
      style={{ backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load() }} tintColor={colors.primary} />}
    >
      <Text className="text-lg font-semibold mb-6" style={{ color: colors.foreground }}>
        {[member.first_name, member.last_name].filter(Boolean).join(' ')}
      </Text>

      <View className="p-6 rounded-2xl border items-center mb-6" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        {qrPayload ? (
          <QRCode value={qrPayload} size={200} color={colors.primary} backgroundColor={colors.card} />
        ) : null}
        <Text className="text-xs uppercase mt-4 text-center tracking-wider" style={{ color: colors.mutedForeground }}>
          {t('qrHint')}
        </Text>
      </View>

      <View className="w-full rounded-xl p-4 border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Text className="text-xs uppercase mb-1" style={{ color: colors.mutedForeground }}>
          {t('membership')}
        </Text>
        <Text style={{ color: colors.foreground }}>{member.membership_type}</Text>
        <Text className="text-xs uppercase mt-3 mb-1" style={{ color: colors.mutedForeground }}>
          {t('status')}
        </Text>
        <Text style={{ color: colors.primary }}>{member.status}</Text>
        {member.expiry_date ? (
          <>
            <Text className="text-xs uppercase mt-3 mb-1" style={{ color: colors.mutedForeground }}>
              {t('expires')}
            </Text>
            <Text style={{ color: colors.foreground }}>{member.expiry_date}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  )
}

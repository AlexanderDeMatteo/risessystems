import { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { fetchCompetitionDetail } from '@/lib/api/competitions'
import { colors } from '@/theme/colors'

export default function MemberCompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cid = parseInt(id ?? '', 10)
      if (Number.isNaN(cid)) {
        setLoading(false)
        return
      }
      const { competition, gyms, challenges, error } = await fetchCompetitionDetail(cid)
      if (cancelled) return
      if (error || !competition) {
        setBody(error ?? 'Not found')
        setLoading(false)
        return
      }
      setTitle(competition.title)
      const lines: string[] = []
      gyms.forEach((g) => lines.push(`${g.gym_name_snapshot}: ${g.active_members_snapshot} members (snapshot)`))
      challenges.forEach((ch) => {
        lines.push(`\n${ch.title}`)
        ch.scores.forEach((s) => {
          const gym = gyms.find((x) => x.user_id === s.user_id)
          lines.push(`  ${gym?.gym_name_snapshot ?? s.user_id}: ${Number(s.weighted_points).toFixed(2)} pts`)
        })
      })
      setBody(lines.join('\n'))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      <Text className="text-xl font-bold mb-2" style={{ color: colors.foreground }}>
        {title || t('competitions')}
      </Text>
      <Text className="font-mono text-sm leading-6" style={{ color: colors.mutedForeground }}>
        {body}
      </Text>
    </ScrollView>
  )
}

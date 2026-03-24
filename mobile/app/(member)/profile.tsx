import { useCallback, useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchMyMemberRow, updateMyMember } from '@/lib/api/members'
import type { Member } from '@/lib/types/member'
import { colors } from '@/theme/colors'

export default function MemberProfileScreen() {
  const { t } = useTranslation()
  const [, setMember] = useState<Member | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchMyMemberRow()
    setMember(data)
    if (data) {
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setEmail(data.email ?? '')
      setPhone(data.phone ?? '')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onSave() {
    setSaving(true)
    const res = await updateMyMember({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
    })
    setSaving(false)
    if (!res.ok) Alert.alert(t('error'), res.error)
    else {
      Alert.alert('OK', 'Profile updated')
      void load()
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }} keyboardShouldPersistTaps="handled">
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        First name
      </Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        className="rounded-lg px-3 py-3 mb-4 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        Last name
      </Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        className="rounded-lg px-3 py-3 mb-4 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        {t('email')}
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="rounded-lg px-3 py-3 mb-4 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        Phone
      </Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="rounded-lg px-3 py-3 mb-6 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />

      <Pressable
        onPress={onSave}
        disabled={saving}
        className="rounded-lg py-4 items-center"
        style={{ backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }}
      >
        <Text className="font-semibold uppercase" style={{ color: colors.primaryForeground }}>
          {t('save')}
        </Text>
      </Pressable>
    </ScrollView>
  )
}

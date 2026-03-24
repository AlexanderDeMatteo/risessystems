import { useCallback, useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { fetchMyTrainerRow, updateMyTrainer } from '@/lib/api/trainers'
import type { Trainer } from '@/lib/types/trainer'
import { colors } from '@/theme/colors'

export default function TrainerProfileScreen() {
  const { t } = useTranslation()
  const [, setTrainer] = useState<Trainer | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await fetchMyTrainerRow()
    setTrainer(data)
    if (data) {
      setName(data.name)
      setEmail(data.email)
      setPhone(data.phone ?? '')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onSave() {
    setSaving(true)
    const res = await updateMyTrainer({
      name: name.trim(),
      email: email.trim(),
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
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
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
        className="rounded-lg px-3 py-3 mb-4 border"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
      />
      <Text className="text-xs uppercase mb-2" style={{ color: colors.mutedForeground }}>
        Phone
      </Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
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

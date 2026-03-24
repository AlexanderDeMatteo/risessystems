import { useState } from 'react'
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { isSupabaseConfigured } from '@/lib/supabase'
import { colors } from '@/theme/colors'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const { session, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)

  if (session) {
    return <Redirect href="/" />
  }

  if (!isSupabaseConfigured()) {
    return (
      <View className="flex-1 p-6 justify-center" style={{ backgroundColor: colors.background }}>
        <Text className="text-foreground">{t('configureSupabase')}</Text>
      </View>
    )
  }

  async function onSubmit() {
    setPending(true)
    const { error } = await signUp(email.trim(), password)
    setPending(false)
    if (error) Alert.alert(t('error'), error)
    else
      Alert.alert(
        t('registerTitle'),
        'Check your email to confirm your account, then ask your gym to link your profile.',
        [{ text: 'OK', onPress: () => {} }]
      )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 p-6 justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold text-foreground mb-1">{t('registerTitle')}</Text>
      <Text className="text-mutedForeground text-sm mb-8">{t('registerSubtitle')}</Text>

      <Text className="text-mutedForeground text-xs uppercase mb-2">{t('email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="rounded-lg px-4 py-3 mb-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, color: colors.foreground }}
        placeholderTextColor={colors.mutedForeground}
      />

      <Text className="text-mutedForeground text-xs uppercase mb-2">{t('password')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="rounded-lg px-4 py-3 mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, color: colors.foreground }}
        placeholderTextColor={colors.mutedForeground}
      />

      <Pressable
        onPress={onSubmit}
        disabled={pending}
        className="rounded-lg py-4 items-center mb-4"
        style={{ backgroundColor: colors.primary, opacity: pending ? 0.6 : 1 }}
      >
        <Text className="font-semibold uppercase" style={{ color: colors.primaryForeground }}>
          {t('signUp')}
        </Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable>
          <Text className="text-primary text-center">{t('signIn')}</Text>
        </Pressable>
      </Link>
    </KeyboardAvoidingView>
  )
}

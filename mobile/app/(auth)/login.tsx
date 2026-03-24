import { useState } from 'react'
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { isSupabaseConfigured } from '@/lib/supabase'
import { colors } from '@/theme/colors'

export default function LoginScreen() {
  const { t } = useTranslation()
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)

  if (session) {
    return <Redirect href="/" />
  }

  if (!isSupabaseConfigured()) {
    return (
      <View className="flex-1 p-6 justify-center" style={{ backgroundColor: colors.background }}>
        <Text className="text-foreground text-base">{t('configureSupabase')}</Text>
      </View>
    )
  }

  async function onSubmit() {
    setPending(true)
    const { error } = await signIn(email.trim(), password)
    setPending(false)
    if (error) Alert.alert(t('error'), error)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 p-6 justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold text-foreground mb-1">{t('loginTitle')}</Text>
      <Text className="text-mutedForeground text-sm mb-8">{t('loginSubtitle')}</Text>

      <Text className="text-mutedForeground text-xs uppercase mb-2 tracking-wider">{t('email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        className="border border-border rounded-lg px-4 py-3 text-foreground mb-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
        placeholderTextColor={colors.mutedForeground}
        placeholder="you@example.com"
      />

      <Text className="text-mutedForeground text-xs uppercase mb-2 tracking-wider">{t('password')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-border rounded-lg px-4 py-3 text-foreground mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
        placeholderTextColor={colors.mutedForeground}
      />

      <Pressable
        onPress={onSubmit}
        disabled={pending}
        className="rounded-lg py-4 items-center mb-4"
        style={{ backgroundColor: colors.primary, opacity: pending ? 0.6 : 1 }}
      >
        <Text className="font-semibold uppercase tracking-wider" style={{ color: colors.primaryForeground }}>
          {t('signIn')}
        </Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable>
          <Text className="text-primary text-center">{t('signUp')}</Text>
        </Pressable>
      </Link>
    </KeyboardAvoidingView>
  )
}

import { useCallback, useRef, useState } from 'react'
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useTranslation } from 'react-i18next'
import { createCheckInForMember, findMemberByQrOrId } from '@/lib/api/check-ins'
import { colors } from '@/theme/colors'

export default function OwnerScannerScreen() {
  const { t } = useTranslation()
  const [permission, requestPermission] = useCameraPermissions()
  const [busy, setBusy] = useState(false)
  const lastScan = useRef<string>('')

  const onBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (busy) return
      if (data === lastScan.current) return
      lastScan.current = data
      setBusy(true)
      try {
        const member = await findMemberByQrOrId(data.trim())
        if (!member) {
          Alert.alert(t('error'), t('memberNotFound'))
          return
        }
        const res = await createCheckInForMember(member.id)
        if (!res.ok) Alert.alert(t('error'), res.error)
        else Alert.alert('OK', `${t('checkInSuccess')}: ${member.name}`)
      } finally {
        setBusy(false)
        setTimeout(() => {
          lastScan.current = ''
        }, 2500)
      }
    },
    [busy, t]
  )

  if (!permission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>{t('loading')}</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, padding: 24 }]}>
        <Text className="text-center mb-4" style={{ color: colors.foreground }}>
          Camera permission is required to scan QR codes.
        </Text>
        <Pressable onPress={requestPermission} className="rounded-lg py-3 px-6" style={{ backgroundColor: colors.primary }}>
          <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Grant permission</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onBarcodeScanned}
      />
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/60">
        <Text className="text-center text-sm" style={{ color: colors.foreground }}>
          {t('scanQr')}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

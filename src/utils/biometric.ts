import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

export async function isBiometricAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const result = await NativeBiometric.isAvailable({ useFallback: false });
    return result.isAvailable;
  } catch {
    return false;
  }
}

export async function verifyBiometric(reason = 'Déverrouille Veyrion'): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await NativeBiometric.verifyIdentity({
      reason,
      title: 'Veyrion',
      subtitle: 'Déverrouillage biométrique',
      description: reason,
    });
    return true;
  } catch {
    return false;
  }
}

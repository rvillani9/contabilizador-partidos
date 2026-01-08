import { Platform } from 'react-native';

export function getApiBase(): string {
  // 1) Env var EXPO_PUBLIC_API_BASE tiene prioridad si existe
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // 2) app.json extra
  try {
    const base = require('../../app.json').expo.extra.API_BASE as string | undefined;
    if (base) return base.replace(/\/$/, '');
  } catch {}

  // 3) Heurística por plataforma
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080/api'; // Emulador Android
  if (Platform.OS === 'ios') return 'http://localhost:8080/api';     // Simulador iOS
  return 'http://localhost:8080/api'; // Web
}


import { Platform } from 'react-native';

export function getApiBase(): string {
  // 1) Intentar leer desde variables de entorno (Lo más recomendado para Web)
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // 2) Intentar leer de app.json de forma SEGURA
  try {
    // Usamos el encadenamiento opcional (?.) para evitar el error de "undefined"
    const appConfig = require('../app.json');
    const base = appConfig?.expo?.extra?.API_BASE;

    if (base) return base.replace(/\/$/, '');
  } catch (e) {
    console.warn("No se pudo leer API_BASE desde app.json");
  }

  // 3) Heurística por plataforma (Fallbacks)
  // IMPORTANTE: En Web, 'localhost' funciona bien.
  // En Android real o emulador, a veces necesitas la IP de tu PC.
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080/api';
  if (Platform.OS === 'ios') return 'http://localhost:8080/api';

  return 'http://localhost:8080/api'; // Web
}
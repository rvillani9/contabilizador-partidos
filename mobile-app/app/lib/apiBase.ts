import { Platform } from 'react-native';

export function getApiBase(): string {
  // 1) Si definiste la variable en un archivo .env, tiene prioridad total
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // 2) DETECCIÓN DE PRODUCCIÓN: Si la app no está en modo desarrollo (Build final)
  // O si simplemente quieres que el celular físico ya use el backend de la nube
  if (!__DEV__) {
    return 'https://contador-futbolero.onrender.com/api';
  }

  // 3) DESARROLLO LOCAL: Fallbacks por plataforma
  // Si estás probando en emulador, usa estas IPs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api'; // IP especial para emulador Android
  }

  // Para iOS Simulator o Expo Web corriendo en tu PC
  return 'http://localhost:8080/api';
}
import { Platform } from 'react-native';

export function getApiBase(): string {
  // Si estamos en un navegador (Web)
  if (Platform.OS === 'web') {
    // Si la URL del navegador NO contiene "localhost", estamos en producción
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      return '/api'; // Usa la URL relativa de Render
    }
  }

  // Si no es web o es localhost, usamos los fallbacks de desarrollo
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080/api';
  return 'http://localhost:8080/api';
}
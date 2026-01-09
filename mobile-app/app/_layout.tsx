import { Stack } from 'expo-router';
import { ThemeProvider } from './lib/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="resumen" />
        <Stack.Screen name="gestion" />
        <Stack.Screen name="equipos" />
        <Stack.Screen name="partidos" />
        <Stack.Screen name="usuarios" />
        <Stack.Screen name="(main)" />
      </Stack>
    </ThemeProvider>
  );
}

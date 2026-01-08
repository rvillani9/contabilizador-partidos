import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Pantalla inicial de selección/creación de usuario */}
      <Stack.Screen name="index" options={{ title: 'Elegir usuario' }} />
      {/* Pestañas principales una vez seleccionado el usuario */}
      <Stack.Screen name="resumen" options={{ headerShown: false }} />
      <Stack.Screen name="gestion" options={{ headerShown: false }} />
    </Stack>
  );
}

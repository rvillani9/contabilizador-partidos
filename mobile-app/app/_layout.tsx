import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Pantalla inicial de selección/creación de usuario */}
      <Stack.Screen name="index" options={{ title: 'Elegir usuario', headerStyle: { backgroundColor: '#0A84FF' }, headerTintColor: '#fff' }} />
      {/* Pestañas principales una vez seleccionado el usuario */}
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}

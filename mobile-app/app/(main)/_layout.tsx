import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0A84FF' }}>
      <Tabs.Screen name="resumen" options={{ title: 'Resumen', headerStyle: { backgroundColor: '#0A84FF' }, headerTintColor: '#fff' }} />
      <Tabs.Screen name="gestion" options={{ title: 'Gestión', headerStyle: { backgroundColor: '#0A84FF' }, headerTintColor: '#fff' }} />
    </Tabs>
  );
}


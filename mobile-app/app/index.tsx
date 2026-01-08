import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contabilizador</Text>
      <Link style={styles.link} href="/usuarios">Usuarios</Link>
      <Link style={styles.link} href="/equipos">Equipos</Link>
      <Link style={styles.link} href="/partidos">Partidos</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  link: { fontSize: 18, color: '#007AFF' },
});


import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Resumen() {
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const base = process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE);
  const [resumen, setResumen] = useState<any>(null);
  useEffect(()=>{
    if (usuarioId) {
      fetch(`${base}/usuarios/${usuarioId}/resumen`).then(r=>r.json()).then(setResumen).catch(console.error);
    }
  }, [usuarioId]);
  if (!usuarioId) return <View style={styles.container}><Text>Selecciona un usuario primero.</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de {resumen?.usuario ?? ''}</Text>
      <Text>Total de goles: {resumen?.totalGoles ?? 0}</Text>
      <Text style={styles.subtitle}>Goles por equipo</Text>
      <FlatList data={Object.entries(resumen?.golesPorEquipo ?? {})}
        keyExtractor={([nombre])=>nombre}
        renderItem={({item:[nombre, cantidad]})=> (
          <View style={styles.row}><Text>{nombre}</Text><Text>{cantidad}</Text></View>
        )}
      />
      <Text style={styles.subtitle}>Partidos por equipo</Text>
      <FlatList data={Object.entries(resumen?.partidosPorEquipo ?? {})}
        keyExtractor={([nombre])=>nombre}
        renderItem={({item:[nombre, cantidad]})=> (
          <View style={styles.row}><Text>{nombre}</Text><Text>{cantidad}</Text></View>
        )}
      />
      <Text>Total de partidos: {resumen?.totalPartidos ?? 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { marginTop: 12, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' }
});


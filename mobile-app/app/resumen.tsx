import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getApiBase } from './lib/apiBase';

export default function Resumen() {
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const router = useRouter();
  const base = getApiBase();
  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    if (usuarioId) {
      setLoading(true);
      fetch(`${base}/usuarios/${usuarioId}/resumen`).then(r=>r.json()).then(setResumen).catch((e)=>{
        console.error(e);
        Alert.alert('No se pudo cargar el resumen', `Revisa el backend: ${base}`);
      }).finally(()=>setLoading(false));
    }
  }, [usuarioId]);
  if (!usuarioId) return <View style={styles.container}><Text>Selecciona un usuario primero.</Text></View>;
  if (loading) return <View style={styles.container}><ActivityIndicator /></View>;
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Resumen</Text></View>
      <View style={styles.content}>
        <Text style={styles.title}>De {resumen?.usuario ?? ''}</Text>
        <Text style={styles.total}>Total de goles: {resumen?.totalGoles ?? 0}</Text>
        <Text style={styles.subtitle}>Goles por equipo</Text>
        <FlatList data={Object.entries(resumen?.golesPorEquipo ?? {})}
          keyExtractor={([nombre])=>nombre}
          renderItem={({item:[nombre, cantidad]})=> (
            <View style={styles.row}><Text>{nombre}</Text><Text>{String(cantidad)}</Text></View>
          )}
        />
        <Text style={styles.subtitle}>Partidos por equipo</Text>
        <FlatList data={Object.entries(resumen?.partidosPorEquipo ?? {})}
          keyExtractor={([nombre])=>nombre}
          renderItem={({item:[nombre, cantidad]})=> (
            <View style={styles.row}><Text>{nombre}</Text><Text>{String(cantidad)}</Text></View>
          )}
        />
        <Text style={styles.total}>Total de partidos: {resumen?.totalPartidos ?? 0}</Text>
        <View style={{ marginTop: 16 }}>
          <Button title="Ir a Gestión" onPress={()=> router.push({ pathname: '/gestion', params: { usuarioId: String(usuarioId) } })} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  header: { backgroundColor: '#0A84FF', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  subtitle: { marginTop: 12, fontWeight: 'bold', color: '#333' },
  total: { marginTop: 8, fontWeight: '600', color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' }
});

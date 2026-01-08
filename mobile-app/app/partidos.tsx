import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Button, Alert } from 'react-native';

export default function Partidos() {
  const base = process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE);
  const [partidos, setPartidos] = useState<any[]>([]);
  useEffect(() => { cargar(); }, []);
  function cargar() {
    fetch(`${base}/torneos`).then(r=>r.json()).then(ts=>{
      fetch(`${base}/partidos`).then(r=>r.json()).then(setPartidos).catch(console.error);
    }).catch(console.error);
  }
  function reclamarGol(partidoId: number) {
    Alert.prompt('Reclamar gol', 'Ingresa usuarioId,equipoId,numero', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'OK', onPress: (value) => {
        const [usuarioId, equipoId, numero] = String(value).split(',');
        fetch(`${base}/partidos/${partidoId}/reclamar-gol?usuarioId=${usuarioId}&equipoId=${equipoId}&numero=${numero}`, { method: 'POST' })
          .then(()=>{ Alert.alert('Gol reclamado'); cargar(); })
          .catch(e=>Alert.alert('Error', String(e)));
      }}
    ], 'plain-text');
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partidos</Text>
      <FlatList data={partidos} keyExtractor={u => String(u.id)}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text>{item.equipoLocal?.nombre} {item.golesLocal} - {item.golesVisitante} {item.equipoVisitante?.nombre}</Text>
            <Button title="Reclamar gol" onPress={()=>reclamarGol(item.id)} />
          </View>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, marginBottom: 8 }, card: { padding: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 8, borderRadius: 6 } });


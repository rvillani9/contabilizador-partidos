import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getApiBase } from './lib/apiBase';

export default function Gestion() {
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const base = getApiBase();
  const [torneoId, setTorneoId] = useState('');
  const [localId, setLocalId] = useState('');
  const [visitanteId, setVisitanteId] = useState('');
  const [golesLocal, setGolesLocal] = useState('0');
  const [golesVisitante, setGolesVisitante] = useState('0');
  const [partidoId, setPartidoId] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [numero, setNumero] = useState('');

  function crearPartido() {
    if (!usuarioId) { Alert.alert('Selecciona un usuario primero'); return; }
    const url = `${base}/partidos?torneoId=${torneoId}&localId=${localId}&visitanteId=${visitanteId}&cargadoPorId=${usuarioId}&golesLocal=${golesLocal}&golesVisitante=${golesVisitante}`;
    fetch(url, { method: 'POST' }).then(r=>r.json()).then(p=>{
      if (!p?.id) throw new Error('Respuesta inválida');
      Alert.alert('Partido creado', `ID ${p.id}`);
      setPartidoId(String(p.id));
    }).catch(e=>Alert.alert('Error al crear partido', String(e)));
  }
  function reclamarGol() {
    const url = `${base}/partidos/${partidoId}/reclamar-gol?usuarioId=${usuarioId}&equipoId=${equipoId}&numero=${numero}`;
    fetch(url, { method: 'POST' }).then(()=>{
      Alert.alert('Gol reclamado');
    }).catch(e=>Alert.alert('Error al reclamar gol', String(e)));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Gestión</Text></View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Crear partido</Text>
        <TextInput placeholder="Torneo ID" value={torneoId} onChangeText={setTorneoId} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Equipo Local ID" value={localId} onChangeText={setLocalId} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Equipo Visitante ID" value={visitanteId} onChangeText={setVisitanteId} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Goles Local" value={golesLocal} onChangeText={setGolesLocal} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Goles Visitante" value={golesVisitante} onChangeText={setGolesVisitante} style={styles.input} keyboardType="numeric" />
        <Button title="Crear partido" onPress={crearPartido} />

        <Text style={styles.subtitle}>Reclamar gol</Text>
        <TextInput placeholder="Partido ID" value={partidoId} onChangeText={setPartidoId} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Equipo ID" value={equipoId} onChangeText={setEquipoId} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Número (opcional)" value={numero} onChangeText={setNumero} style={styles.input} keyboardType="numeric" />
        <Button title="Reclamar gol" onPress={reclamarGol} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  header: { backgroundColor: '#0A84FF', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { marginTop: 12, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }
});

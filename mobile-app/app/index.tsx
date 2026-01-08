import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getApiBase } from './lib/apiBase';

export default function Home() {
  const base = getApiBase();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [seleccionado, setSeleccionado] = useState<any | null>(null);
  useEffect(()=>{ cargar(); },[]);
  function cargar(){ fetch(`${base}/usuarios`).then(r=>r.json()).then(setUsuarios).catch((e)=>{
    console.error(e);
    Alert.alert('No se pudo cargar usuarios', `Revisa que el backend esté en ${base}`);
  }); }
  function seleccionar(u:any){ setSeleccionado(u); }
  function continuar(){ if (!seleccionado) { Alert.alert('Selecciona un usuario'); return; }
    router.push({ pathname: '/(main)/resumen', params: { usuarioId: String(seleccionado.id) } }); }
  function crear(){ fetch(`${base}/usuarios`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ nombre, email }) })
    .then(r=>r.json()).then(u=>{ setNombre(''); setEmail(''); cargar(); setSeleccionado(u); continuar(); }).catch((e)=>{
      console.error(e);
      Alert.alert('No se pudo crear el usuario', String(e));
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Contabilizador</Text></View>
      <Text style={styles.sectionTitle}>Selecciona tu usuario</Text>
      {usuarios.length === 0 && <Text style={styles.empty}>No hay usuarios aún. Crea uno abajo.</Text>}
      <FlatList data={usuarios} keyExtractor={u=>String(u.id)}
        renderItem={({item})=> (
          <TouchableOpacity onPress={()=>seleccionar(item)} style={[styles.card, seleccionado?.id===item.id && styles.cardSelected]}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Continuar" onPress={continuar} />
      <Text style={styles.sectionTitle}>Crear usuario</Text>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <Button title="Crear" onPress={crear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#0A84FF', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 6, paddingHorizontal: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8, marginHorizontal: 16 },
  empty: { color: '#666', marginHorizontal: 16 },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  cardSelected: { borderColor: '#0A84FF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#666' }
});

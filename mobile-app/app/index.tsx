import { Link, useRouter } from 'expo-router';
import { Text, View, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';

export default function Home() {
  const base = process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE);
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  useEffect(()=>{ cargar(); },[]);
  function cargar(){ fetch(`${base}/usuarios`).then(r=>r.json()).then(setUsuarios).catch(console.error); }
  function seleccionar(u:any){ router.push({ pathname: '/resumen', params: { usuarioId: String(u.id) } }); }
  function crear(){ fetch(`${base}/usuarios`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ nombre, email }) })
    .then(r=>r.json()).then(u=>{ setNombre(''); setEmail(''); cargar(); seleccionar(u); }).catch(console.error);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contabilizador</Text>
      <Text style={styles.subtitle}>Selecciona tu usuario</Text>
      <FlatList data={usuarios} keyExtractor={u=>String(u.id)}
        renderItem={({item})=> (
          <View style={styles.row}>
            <Text onPress={()=>seleccionar(item)} style={styles.link}>{item.nombre} ({item.email})</Text>
          </View>
        )}
      />
      <Text style={styles.subtitle}>Crear usuario</Text>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <Button title="Crear" onPress={crear} />
      {/* Acceso directo a gestión con último usuario seleccionado */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
  link: { fontSize: 16, color: '#007AFF' },
  row: { paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' }
});

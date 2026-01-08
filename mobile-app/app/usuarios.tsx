import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE)}/usuarios`)
      .then(r => r.json()).then(setUsuarios).catch(console.error);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList data={usuarios} keyExtractor={u => String(u.id)}
        renderItem={({item}) => <Text>{item.nombre} - {item.email}</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, marginBottom: 8 } });


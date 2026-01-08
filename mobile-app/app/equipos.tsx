import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

export default function Equipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE)}/equipos`)
      .then(r => r.json()).then(setEquipos).catch(console.error);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipos</Text>
      <FlatList data={equipos} keyExtractor={u => String(u.id)}
        renderItem={({item}) => <Text>{item.nombre}</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 20, marginBottom: 8 } });


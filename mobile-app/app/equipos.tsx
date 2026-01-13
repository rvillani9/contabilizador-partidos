import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';

export default function Equipos() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const base = process.env.EXPO_PUBLIC_API_BASE ?? (require('../app.json').expo.extra.API_BASE);

  useEffect(() => {
    fetch(`${base}/equipos`)
      .then(r => r.json()).then(setEquipos).catch(console.error);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Equipos</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.btnTheme, { backgroundColor: colors.headerBgLight }]} onPress={toggleDarkMode}>
            <Text>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnMenu, { backgroundColor: colors.headerBgLight }]} onPress={() => setMostrarMenu(!mostrarMenu)}>
            <Text style={styles.btnMenuText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {mostrarMenu && (
        <View style={[styles.menu, { backgroundColor: colors.headerBgLight }]}>
          <TouchableOpacity onPress={() => setMostrarMenu(false)}>
            <Text style={styles.menuItem}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/ranking'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/login'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Acceso</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={equipos}
        keyExtractor={u => String(u.id)}
        renderItem={({item}) => (
          <View style={[styles.card, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.nombre}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  btnTheme: { width: 40, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  btnMenu: { width: 40, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  btnMenuText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  menu: { padding: 12 },
  menuItem: { color: '#fff', padding: 12, fontWeight: '600', fontSize: 16 },
  card: { marginBottom: 8, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' }
});

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getApiBase } from './lib/apiBase';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';

function showAlert(title: string, msg?: string) {
  if (Platform.OS === 'web') alert(`${title}${msg ? `: ${msg}` : ''}`); else Alert.alert(title, msg);
}

export default function Ranking() {
  const base = getApiBase();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [orden, setOrden] = useState<'goles'|'partidos'>('goles');
  const [data, setData] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => { cargar(); }, [orden]);

  async function cargar() {
    try {
      const r = await fetch(`${base}/ranking-usuarios?ordenarPor=${orden}`);
      const text = await r.text();
      if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
      setData(text ? JSON.parse(text) : []);
    } catch (e: any) {
      showAlert('Error', e.message || String(e));
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Ranking usuarios</Text>
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
          {/* Eliminado Usuarios */}
          <TouchableOpacity onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/login'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Acceso</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ padding: 16, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Text style={{ color: colors.textPrimary }}>Ordenar por:</Text>
        <TouchableOpacity onPress={() => setOrden('goles')} style={[styles.pill, orden==='goles' && { backgroundColor: colors.headerBg }]}>
          <Text style={{ color: orden==='goles' ? '#fff' : colors.textPrimary }}>Goles</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrden('partidos')} style={[styles.pill, orden==='partidos' && { backgroundColor: colors.headerBg }]}>
          <Text style={{ color: orden==='partidos' ? '#fff' : colors.textPrimary }}>Partidos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.usuarioId)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <View style={[styles.row, { backgroundColor: colors.bgSecondary, borderColor: colors.inputBorder }]}>
            <Text style={[styles.pos, { color: colors.textSecondary }]}>{index + 1}</Text>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{item.nombre}</Text>
            <Text style={[styles.stat, { color: colors.textPrimary }]}>Goles: {item.goles}</Text>
            <Text style={[styles.stat, { color: colors.textPrimary }]}>Partidos: {item.partidos}</Text>
          </View>
        )}
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
  pill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8, gap: 10 },
  pos: { width: 24, textAlign: 'center' },
  name: { flex: 1 },
  stat: { minWidth: 100, textAlign: 'right' },
});

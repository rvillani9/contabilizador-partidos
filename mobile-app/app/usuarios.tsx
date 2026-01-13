import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';
import { getApiBase } from './lib/apiBase';

export default function Usuarios() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const base = getApiBase();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    fetch(`${base}/usuarios`)
      .then(r => r.json()).then(setUsuarios).catch(console.error);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Usuarios</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.headerBgLight }]} onPress={toggleDarkMode}>
            <Text style={{fontSize: 20}}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.headerBgLight }]} onPress={() => setMostrarMenu(!mostrarMenu)}>
            <Text style={styles.btnMenuText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {mostrarMenu && (
        <View style={[styles.menu, { backgroundColor: colors.bgSecondary }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setMostrarMenu(false)}>
            <Text style={{ color: colors.headerBg, fontWeight: 'bold' }}>Usuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/ranking'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/login'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Acceso</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={usuarios}
        keyExtractor={u => String(u.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({item}) => (
          <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.inputBorder }]}>
            <Text style={[styles.cardName, { color: colors.textPrimary }]}>{item.nombre}</Text>
            <Text style={[styles.cardEmail, { color: colors.textSecondary }]}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnMenuText: { color: '#fff', fontSize: 24 },
  menu: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    elevation: 5,
    zIndex: 10
  },
  menuItem: { padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  card: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1
  },
  cardName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardEmail: { fontSize: 13 }
});

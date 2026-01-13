import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getApiBase } from './lib/apiBase';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';

export default function Resumen() {
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const base = getApiBase();
  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(()=>{
    if (usuarioId) {
      setLoading(true);
      fetch(`${base}/usuarios/${usuarioId}/resumen`)
        .then(r=>r.json())
        .then(setResumen)
        .catch((e)=>{
          console.error(e);
          Alert.alert('No se pudo cargar el resumen', `Revisa el backend: ${base}`);
        })
        .finally(()=>setLoading(false));
    }
  }, [usuarioId]);

  if (!usuarioId) return <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}><Text style={{ color: colors.textPrimary }}>Selecciona un usuario primero.</Text></View>;
  if (loading) return <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}><ActivityIndicator color={colors.headerBg} /></View>;

  const estadisticas = Object.entries(resumen?.golesPorEquipo ?? {}).map(([nombre, goles]: any) => {
    const partidos = resumen?.partidosPorEquipo?.[nombre] || 0;
    const promedio = partidos > 0 ? (goles / partidos).toFixed(2) : '0.00';
    return { nombre, goles, partidos, promedio };
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Resumen</Text>
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
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push({ pathname: '/gestion', params: { usuarioId } }); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Gestión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/ranking'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/login'); setMostrarMenu(false); }}>
            <Text style={{ color: colors.textPrimary }}>Acceso</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.content, { backgroundColor: colors.bgPrimary }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Goles de {resumen?.usuario ?? 'Usuario'}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Equipo: {resumen?.equipo ?? 'N/A'}</Text>

        <View style={[styles.statsBox, { backgroundColor: colors.bgSecondary, borderColor: colors.borderPrimary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Partidos Jugados</Text>
            <Text style={[styles.statValue, { color: colors.headerBg }]}>{resumen?.totalPartidos ?? 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Goles Anotados</Text>
            <Text style={[styles.statValue, { color: colors.headerBg }]}>{resumen?.totalGoles ?? 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Promedio de Gol</Text>
            <Text style={[styles.statValue, { color: colors.headerBg }]}>
              {resumen?.totalPartidos > 0 ? ((resumen?.totalGoles / resumen?.totalPartidos).toFixed(2)) : '0.00'}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.headerBg }]}>Goles por Equipo</Text>
        <View style={[styles.table, { backgroundColor: colors.bgSecondary, borderColor: colors.borderPrimary }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.headerBgLight }]}>
            <Text style={[styles.tableCell, styles.tableCellWide, { color: '#fff' }]}>Equipo</Text>
            <Text style={[styles.tableCell, { color: '#fff' }]}>PJ</Text>
            <Text style={[styles.tableCell, { color: '#fff' }]}>G</Text>
            <Text style={[styles.tableCell, { color: '#fff' }]}>Prom</Text>
          </View>
          {estadisticas.map((stat, idx) => (
            <View key={idx} style={[styles.tableRow, { borderBottomColor: colors.borderSecondary }]}>
              <Text style={[styles.tableCell, styles.tableCellWide, { color: colors.textPrimary }]}>{stat.nombre}</Text>
              <Text style={[styles.tableCell, { color: colors.textPrimary }]}>{stat.partidos}</Text>
              <Text style={[styles.tableCell, { color: colors.headerBg, fontWeight: 'bold' }]}>{stat.goles}</Text>
              <Text style={[styles.tableCell, { color: colors.textSecondary }]}>{stat.promedio}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 24, marginBottom: 24 }}>
          <Button
            title="Ir a Gestión"
            onPress={()=> router.push({ pathname: '/gestion', params: { usuarioId: String(usuarioId) } })}
            color={colors.buttonBg}
          />
        </View>
      </View>
    </ScrollView>
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
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },
  statsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  table: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  tableCellWide: {
    flex: 1.5,
    textAlign: 'left'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center'
  }
});

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getApiBase } from './lib/apiBase';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';

interface Equipo {
  id: number;
  nombre: string;
}

interface Torneo {
  id: number;
  nombre: string;
}

export default function Gestion() {
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const router = useRouter();
  const base = getApiBase();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Estados para crear torneo
  const [nombreTorneo, setNombreTorneo] = useState('');
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [showTorneoDropdown, setShowTorneoDropdown] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState<Torneo | null>(null);

  // Estados para crear partido
  const [instancia, setInstancia] = useState('');
  const [equipoLocalNombre, setEquipoLocalNombre] = useState('');
  const [equipoVisitanteNombre, setEquipoVisitanteNombre] = useState('');
  const [golesLocal, setGolesLocal] = useState('0');
  const [golesVisitante, setGolesVisitante] = useState('0');
  const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
  const [showEquiposLocal, setShowEquiposLocal] = useState(false);
  const [showEquiposVisitante, setShowEquiposVisitante] = useState(false);
  const [equipoLocalId, setEquipoLocalId] = useState('');
  const [equipoVisitanteId, setEquipoVisitanteId] = useState('');

  // Estados para reclamar gol
  const [partidoId, setPartidoId] = useState('');
  const [equipoReclamarNombre, setEquipoReclamarNombre] = useState('');
  const [equipoReclamerId, setEquipoReclamerId] = useState('');
  const [numero, setNumero] = useState('');
  const [showEquiposReclamar, setShowEquiposReclamar] = useState(false);

  useEffect(() => {
    cargarTorneos();
    cargarEquipos();
  }, []);

  async function cargarTorneos() {
    try {
      const response = await fetch(`${base}/torneos`);
      const data = await response.json();
      setTorneos(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function cargarEquipos() {
    try {
      const response = await fetch(`${base}/equipos`);
      const data = await response.json();
      setEquiposDisponibles(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function crearTorneo() {
    if (!nombreTorneo.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del torneo');
      return;
    }
    try {
      const response = await fetch(`${base}/torneos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreTorneo })
      });
      const data = await response.json();
      Alert.alert('Éxito', `Torneo creado con ID ${data.id}`);
      setNombreTorneo('');
      await cargarTorneos();
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  async function crearPartido() {
    if (!torneoSeleccionado) {
      Alert.alert('Error', 'Selecciona un torneo');
      return;
    }
    if (!instancia.trim()) {
      Alert.alert('Error', 'Ingresa la instancia (ej: Fecha 1, Final)');
      return;
    }
    if (!equipoLocalId || !equipoVisitanteId) {
      Alert.alert('Error', 'Selecciona ambos equipos');
      return;
    }
    if (equipoLocalId === equipoVisitanteId) {
      Alert.alert('Error', 'Los equipos deben ser diferentes');
      return;
    }

    try {
      const url = `${base}/partidos?torneoId=${torneoSeleccionado.id}&localId=${equipoLocalId}&visitanteId=${equipoVisitanteId}&instancia=${encodeURIComponent(instancia)}&golesLocal=${golesLocal}&golesVisitante=${golesVisitante}&cargadoPorId=${usuarioId}`;
      console.log('URL Crear Partido:', url);
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      Alert.alert('Éxito', `Partido creado con ID ${data.id}`);
      setPartidoId(String(data.id));
      // Limpiar
      setInstancia('');
      setEquipoLocalNombre('');
      setEquipoVisitanteNombre('');
      setEquipoLocalId('');
      setEquipoVisitanteId('');
      setGolesLocal('0');
      setGolesVisitante('0');
    } catch (e) {
      console.error('Error crear partido:', e);
      Alert.alert('Error', String(e));
    }
  }

  async function reclamarGol() {
    if (!partidoId || !equipoReclamerId) {
      Alert.alert('Error', 'Completa Partido ID y selecciona un equipo');
      return;
    }
    try {
      const url = `${base}/partidos/${partidoId}/reclamar-gol?equipoId=${equipoReclamerId}&numero=${numero}`;
      await fetch(url, { method: 'POST' });
      Alert.alert('Éxito', 'Gol reclamado');
      setPartidoId('');
      setEquipoReclamarNombre('');
      setEquipoReclamerId('');
      setNumero('');
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  }

  async function buscarEquipos(nombre: string) {
    if (nombre.trim().length < 2) return [];
    try {
      const response = await fetch(`${base}/equipos/buscar?nombre=${encodeURIComponent(nombre)}`);
      return await response.json();
    } catch (e) {
      return [];
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Gestión</Text>
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
          <TouchableOpacity onPress={() => { router.push('/'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Usuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push({ pathname: '/resumen', params: { usuarioId } }); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Resumen</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.content, { backgroundColor: colors.bgPrimary }]}>
        <Text style={[styles.sectionTitle, { color: colors.headerBg }]}>Crear Torneo</Text>
        <TextInput
          placeholder="Nombre del torneo"
          value={nombreTorneo}
          onChangeText={setNombreTorneo}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button title="Crear Torneo" onPress={crearTorneo} color={colors.buttonBg} />

        <Text style={[styles.sectionTitle, { color: colors.headerBg }]}>Crear Partido</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Torneo</Text>
        <TouchableOpacity
          style={[styles.dropdownBtn, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
          onPress={() => setShowTorneoDropdown(!showTorneoDropdown)}
        >
          <Text style={{ color: torneoSeleccionado ? colors.textPrimary : colors.inputPlaceholder }}>
            {torneoSeleccionado ? torneoSeleccionado.nombre : 'Selecciona torneo'}
          </Text>
        </TouchableOpacity>
        {showTorneoDropdown && (
          <View style={[styles.dropdown, { backgroundColor: colors.bgSecondary, borderColor: colors.borderPrimary }]}>
            {torneos.map(t => (
              <TouchableOpacity
                key={t.id}
                style={styles.dropdownItem}
                onPress={() => { setTorneoSeleccionado(t); setShowTorneoDropdown(false); }}
              >
                <Text style={{ color: colors.textPrimary }}>{t.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Instancia (Fecha 1, Final, etc.)</Text>
        <TextInput
          placeholder="Ej: Fecha 1, Semifinal, Final"
          value={instancia}
          onChangeText={setInstancia}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Equipo Local</Text>
        <TextInput
          placeholder="Busca o crea equipo"
          value={equipoLocalNombre}
          onChangeText={async (text) => {
            setEquipoLocalNombre(text);
            if (text.length >= 2) {
              const equipos = await buscarEquipos(text);
              if (equipos.length > 0) {
                setShowEquiposLocal(true);
              }
            }
          }}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        {showEquiposLocal && equipoLocalNombre.length >= 2 && (
          <View style={[styles.dropdown, { backgroundColor: colors.bgSecondary }]}>
            {equiposDisponibles
              .filter(e => e.nombre.toLowerCase().includes(equipoLocalNombre.toLowerCase()))
              .map(e => (
                <TouchableOpacity
                  key={e.id}
                  style={styles.dropdownItem}
                  onPress={() => { setEquipoLocalNombre(e.nombre); setEquipoLocalId(String(e.id)); setShowEquiposLocal(false); }}
                >
                  <Text style={{ color: colors.textPrimary }}>{e.nombre}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Equipo Visitante</Text>
        <TextInput
          placeholder="Busca o crea equipo"
          value={equipoVisitanteNombre}
          onChangeText={async (text) => {
            setEquipoVisitanteNombre(text);
            if (text.length >= 2) {
              const equipos = await buscarEquipos(text);
              if (equipos.length > 0) {
                setShowEquiposVisitante(true);
              }
            }
          }}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        {showEquiposVisitante && equipoVisitanteNombre.length >= 2 && (
          <View style={[styles.dropdown, { backgroundColor: colors.bgSecondary }]}>
            {equiposDisponibles
              .filter(e => e.nombre.toLowerCase().includes(equipoVisitanteNombre.toLowerCase()))
              .map(e => (
                <TouchableOpacity
                  key={e.id}
                  style={styles.dropdownItem}
                  onPress={() => { setEquipoVisitanteNombre(e.nombre); setEquipoVisitanteId(String(e.id)); setShowEquiposVisitante(false); }}
                >
                  <Text style={{ color: colors.textPrimary }}>{e.nombre}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <TextInput
          placeholder="Goles Local"
          value={golesLocal}
          onChangeText={setGolesLocal}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <TextInput
          placeholder="Goles Visitante"
          value={golesVisitante}
          onChangeText={setGolesVisitante}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button title="Crear Partido" onPress={crearPartido} color={colors.buttonBg} />

        <Text style={[styles.sectionTitle, { color: colors.headerBg }]}>Reclamar Gol</Text>
        <TextInput
          placeholder="Partido ID"
          value={partidoId}
          onChangeText={setPartidoId}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <TextInput
          placeholder="Busca equipo"
          value={equipoReclamarNombre}
          onChangeText={async (text) => {
            setEquipoReclamarNombre(text);
            if (text.length >= 2) {
              const equipos = await buscarEquipos(text);
              if (equipos.length > 0) {
                setShowEquiposReclamar(true);
              }
            }
          }}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        {showEquiposReclamar && equipoReclamarNombre.length >= 2 && (
          <View style={[styles.dropdown, { backgroundColor: colors.bgSecondary }]}>
            {equiposDisponibles
              .filter(e => e.nombre.toLowerCase().includes(equipoReclamarNombre.toLowerCase()))
              .map(e => (
                <TouchableOpacity
                  key={e.id}
                  style={styles.dropdownItem}
                  onPress={() => { setEquipoReclamarNombre(e.nombre); setEquipoReclamerId(String(e.id)); setShowEquiposReclamar(false); }}
                >
                  <Text style={{ color: colors.textPrimary }}>{e.nombre}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
        <TextInput
          placeholder="Número (opcional)"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button title="Reclamar Gol" onPress={reclamarGol} color={colors.buttonBgSecondary} />
      </View>
    </ScrollView>
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
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 2, borderRadius: 8, padding: 12, marginBottom: 12 },
  dropdownBtn: { borderWidth: 2, borderRadius: 8, padding: 12, marginBottom: 12 },
  dropdown: { borderWidth: 2, borderRadius: 8, marginBottom: 12, maxHeight: 150 },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
});


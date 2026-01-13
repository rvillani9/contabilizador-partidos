import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';
import { getApiBase } from './lib/apiBase';

export default function Login() {
  const base = getApiBase();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colors = getColors(isDarkMode);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const mostrarMensaje = (titulo: string, msj?: string) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}${msj ? ': ' + msj : ''}`);
    } else {
      Alert.alert(titulo, msj);
    }
  };

  useEffect(() => {
    fetch(`${base}/usuarios`).then(r => r.json()).then(setUsuarios).catch(console.error);
  }, [base]);

  const usuarioExistente = useMemo(() => {
    if (!email) return null;
    const e = email.trim().toLowerCase();
    return usuarios.find(u => String(u.email || '').trim().toLowerCase() === e) || null;
  }, [email, usuarios]);

  const iniciarSesion = () => {
    if (!email.trim()) {
      mostrarMensaje('Faltan datos', 'Ingresa tu email');
      return;
    }
    if (!usuarioExistente) {
      mostrarMensaje('No encontrado', 'Ese email no está registrado. Puedes registrarte abajo.');
      return;
    }
    router.push({ pathname: '/resumen', params: { usuarioId: String(usuarioExistente.id) } });
  };

  const registrar = () => {
    const e = email.trim();
    const n = nombre.trim();
    if (!e || !n) {
      mostrarMensaje('Faltan datos', 'Completa nombre y email');
      return;
    }
    fetch(`${base}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: n, email: e })
    })
      .then(r => r.json())
      .then(u => {
        mostrarMensaje('Registrado', 'Accediendo...');
        router.push({ pathname: '/resumen', params: { usuarioId: String(u.id) } });
      })
      .catch(() => mostrarMensaje('Error', 'No se pudo registrar'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerTitle}>Acceso</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.headerBgLight }]} onPress={toggleDarkMode}>
            <Text>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.headerBgLight }]} onPress={() => setMostrarMenu(!mostrarMenu)}>
            <Text style={styles.btnMenuText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {mostrarMenu && (
        <View style={[styles.menu, { backgroundColor: colors.headerBgLight }]}>
          <TouchableOpacity onPress={() => setMostrarMenu(false)}>
            <Text style={styles.menuItem}>Acceso</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Usuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Equipos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Partidos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/ranking'); setMostrarMenu(false); }}>
            <Text style={styles.menuItem}>Ranking</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Iniciar sesión</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button title="Entrar" onPress={iniciarSesion} color={colors.buttonBg} />
      </View>

      <View style={{ padding: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Registrar nuevo</Text>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button title="Registrar y Entrar" onPress={registrar} color={colors.buttonBg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  btnMenuText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  menu: { padding: 12 },
  menuItem: { color: '#fff', padding: 12, fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10 }
});


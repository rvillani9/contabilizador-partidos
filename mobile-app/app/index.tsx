import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getApiBase } from './lib/apiBase';
import { useTheme } from './lib/ThemeContext';
import { getColors } from './lib/colors';

export default function Home() {
    const base = getApiBase();
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const colors = getColors(isDarkMode);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [seleccionado, setSeleccionado] = useState<any | null>(null);
    const [mostrarMenu, setMostrarMenu] = useState(false);

    // Función para mostrar mensajes en Web y Móvil
    const mostrarError = (titulo: string, msj?: string) => {
        if (Platform.OS === 'web') {
            alert(`${titulo}: ${msj || ''}`);
        } else {
            Alert.alert(titulo, msj);
        }
    };

    const cargar = useCallback(() => {
        fetch(`${base}/usuarios`)
            .then(r => r.json())
            .then(setUsuarios)
            .catch((e) => {
                console.error(e);
                mostrarError('Error de conexión', `Revisa el backend en ${base}`);
            });
    }, [base]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    function seleccionar(u: any) {
        setSeleccionado(u);
    }

    function continuar(id?: string) {
        const usuarioId = id || seleccionado?.id;
        if (!usuarioId) {
            mostrarError('Atención', 'Selecciona un usuario');
            return;
        }
        router.push({
            pathname: '/resumen',
            params: { usuarioId: String(usuarioId) }
        });
    }

    function crear() {
        if (!nombre || !email) {
            mostrarError('Faltan datos', 'Completa nombre y email');
            return;
        }

        fetch(`${base}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email })
        })
            .then(r => r.json())
            .then(u => {
                setNombre('');
                setEmail('');
                continuar(u.id);
            })
            .catch((e) => {
                console.error(e);
                mostrarError('Error', 'No se pudo crear el usuario');
            });
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
                <Text style={styles.headerTitle}>Contabilizador</Text>
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
                        <Text style={styles.menuItem}>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
                        <Text style={styles.menuItem}>Equipos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { router.push('/partidos'); setMostrarMenu(false); }}>
                        <Text style={styles.menuItem}>Partidos</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Selecciona tu usuario</Text>

            {usuarios.length === 0 && <Text style={[styles.empty, { color: colors.textSecondary }]}>No hay usuarios aún.</Text>}

            <FlatList
                data={usuarios}
                keyExtractor={u => String(u.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => seleccionar(item)}
                        style={[styles.card, { backgroundColor: colors.bgSecondary }, seleccionado?.id === item.id && { backgroundColor: colors.accentLight }]}
                    >
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.nombre}</Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{item.email}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={{ padding: 16 }}>
                <Button title="Continuar" onPress={() => continuar()} color={colors.buttonBg} />
            </View>

            <View style={[styles.footer, { backgroundColor: colors.bgSecondary }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Crear nuevo</Text>
                <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]} placeholderTextColor={colors.inputPlaceholder} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]} placeholderTextColor={colors.inputPlaceholder} />
                <Button title="Crear y Entrar" onPress={crear} color={colors.buttonBg} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    btnTheme: { width: 40, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    btnMenu: { width: 40, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    btnMenuText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    menu: { padding: 12 },
    menuItem: { color: '#fff', padding: 12, fontWeight: '600', fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, paddingHorizontal: 16 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, marginHorizontal: 16 },
    empty: { textAlign: 'center', marginTop: 20 },
    card: { marginHorizontal: 16, marginBottom: 8, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 14, marginTop: 4 },
    footer: { paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10 }
});
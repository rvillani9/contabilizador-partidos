import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './lib/ThemeContext'; // Ajusté la ruta a ../
import { getColors } from './lib/colors';
import { getApiBase } from './lib/apiBase';

export default function Partidos() {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const colors = getColors(isDarkMode);
    const base = getApiBase();

    const [partidos, setPartidos] = useState<any[]>([]);
    const [mostrarMenu, setMostrarMenu] = useState(false);

    useEffect(() => {
        cargar();
    }, []);

    function cargar() {
        fetch(`${base}/partidos`)
            .then(r => r.json())
            .then(setPartidos)
            .catch(e => console.error("Error al cargar partidos:", e));
    }

    function reclamarGol(partidoId: number) {
        // Alert.prompt NO funciona en Android ni Web.
        // Usamos una solución compatible:
        if (Platform.OS === 'ios') {
            Alert.prompt('Reclamar gol', 'Ingresa: usuarioId,equipoId,numero', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'OK', onPress: (value) => procesarReclamo(partidoId, String(value)) }
            ]);
        } else {
            // Para Web y Android usamos un prompt simple del navegador o pedimos los datos por consola/otro medio
            const res = prompt("Ingresa: usuarioId,equipoId,numero (separados por coma)");
            if (res) procesarReclamo(partidoId, res);
        }
    }

    function procesarReclamo(partidoId: number, value: string) {
        const [usuarioId, equipoId, numero] = value.split(',').map(s => s.trim());

        if (!usuarioId || !equipoId || !numero) {
            Alert.alert("Error", "Formato incorrecto. Debe ser: id_usuario, id_equipo, numero_gol");
            return;
        }

        fetch(`${base}/partidos/${partidoId}/reclamar-gol?usuarioId=${usuarioId}&equipoId=${equipoId}&numero=${numero}`, {
            method: 'POST'
        })
            .then(async (r) => {
                if (!r.ok) throw new Error("Error en el servidor");
                Alert.alert('Éxito', 'Gol reclamado correctamente');
                cargar();
            })
            .catch(e => Alert.alert('Error', "No se pudo reclamar el gol"));
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
                <Text style={styles.headerTitle}>Partidos</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.iconBtn} onPress={toggleDarkMode}>
                        <Text style={{fontSize: 20}}>{isDarkMode ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setMostrarMenu(!mostrarMenu)}>
                        <Text style={styles.btnMenuText}>☰</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MENU DROPDOWN */}
            {mostrarMenu && (
                <View style={[styles.menu, { backgroundColor: colors.bgSecondary }]}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/'); setMostrarMenu(false); }}>
                        <Text style={{ color: colors.textPrimary }}>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
                        <Text style={{ color: colors.textPrimary }}>Equipos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMostrarMenu(false)}>
                        <Text style={{ color: colors.headerBg, fontWeight: 'bold' }}>Partidos</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* LISTA */}
            <FlatList
                data={partidos}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({item}) => (
                    <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.inputBorder }]}>
                        <Text style={[styles.cardText, { color: colors.textPrimary }]}>
                            {item.equipoLocal?.nombre} <Text style={{color: colors.headerBg}}>{item.golesLocal}</Text> — <Text style={{color: colors.headerBg}}>{item.golesVisitante}</Text> {item.equipoVisitante?.nombre}
                        </Text>
                        <Text style={[styles.instancia, { color: colors.textSecondary }]}>
                            Instancia: {item.instancia || 'Fase de Grupos'}
                        </Text>
                        <TouchableOpacity
                            style={[styles.actionBtn, {backgroundColor: colors.headerBg}]}
                            onPress={() => reclamarGol(item.id)}
                        >
                            <Text style={styles.actionBtnText}>Reclamar Gol</Text>
                        </TouchableOpacity>
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
    headerButtons: { flexDirection: 'row', gap: 10 },
    iconBtn: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
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
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1
    },
    cardText: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
    instancia: { fontSize: 13, textAlign: 'center', marginBottom: 15 },
    actionBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
    actionBtnText: { color: '#fff', fontWeight: 'bold' }
});
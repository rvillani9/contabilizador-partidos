import { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from './lib/ThemeContext'; // Ajusté la ruta a ../
import { getColors } from './lib/colors';
import { getApiBase } from './lib/apiBase';

function showAlert(title: string, msg?: string) {
    if (Platform.OS === 'web') {
        alert(`${title}${msg ? `: ${msg}` : ''}`);
    } else {
        Alert.alert(title, msg);
    }
}

export default function Partidos() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const colors = getColors(isDarkMode);
    const base = getApiBase();

    const [partidos, setPartidos] = useState<any[]>([]);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [equipos, setEquipos] = useState<any[]>([]);
    const [filtroLocalId, setFiltroLocalId] = useState<string>('');

    useEffect(() => {
        cargarEquipos();
        cargar();
    }, []);

    // Re-cargar cuando cambia el filtro para evitar desfases
    useEffect(() => {
        cargar();
    }, [filtroLocalId]);

    function cargar() {
        const url = filtroLocalId ? `${base}/partidos?localId=${filtroLocalId}` : `${base}/partidos`;
        fetch(url)
            .then(async r => {
                const text = await r.text();
                if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
                return text ? JSON.parse(text) : [];
            })
            .then(setPartidos)
            .catch(e => showAlert('Error', e.message || String(e)));
    }

    function cargarEquipos() {
        fetch(`${base}/equipos`)
            .then(async r => {
                const text = await r.text();
                if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
                return text ? JSON.parse(text) : [];
            })
            .then(setEquipos)
            .catch(e => showAlert('Error', e.message || String(e)));
    }

    function aplicarFiltro(id: string) {
        setFiltroLocalId(id);
    }

    function limpiarFiltro() {
        setFiltroLocalId('');
    }

    function reclamarGol(partidoId: number) {
        const necesitaUsuario = !usuarioId;
        if (Platform.OS === 'ios') {
            Alert.prompt('Reclamar gol', `Ingresa: ${necesitaUsuario ? 'usuarioId,' : ''}equipoId,numero`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'OK', onPress: (value) => procesarReclamo(partidoId, String(value), necesitaUsuario) }
            ]);
        } else {
            const res = prompt(`Ingresa: ${necesitaUsuario ? 'usuarioId,' : ''}equipoId,numero (separados por coma)`);
            if (res) procesarReclamo(partidoId, res, necesitaUsuario);
        }
    }

    function procesarReclamo(partidoId: number, value: string, necesitaUsuario: boolean) {
        const partes = value.split(',').map(s => s.trim());
        let uId = usuarioId as string | undefined;
        let equipoId: string | undefined;
        let numero: string | undefined;

        if (necesitaUsuario) {
            [uId, equipoId, numero] = partes;
        } else {
            [equipoId, numero] = partes;
        }

        if (!uId) {
            showAlert("Error", "Falta usuarioId");
            return;
        }
        if (!equipoId) {
            showAlert("Error", "Falta equipoId");
            return;
        }

        const url = `${base}/partidos/${partidoId}/reclamar-gol?usuarioId=${uId}&equipoId=${equipoId}${numero ? `&numero=${numero}` : ''}`;
        fetch(url, { method: 'POST' })
            .then(async (r) => {
                const text = await r.text();
                if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
                showAlert('Éxito', 'Gol reclamado correctamente');
                cargar();
            })
            .catch(e => showAlert('Error', e.message || 'No se pudo reclamar el gol'));
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

            {/* FILTRO POR EQUIPO LOCAL */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8 }}>
                <Text style={{ color: colors.textPrimary, marginBottom: 6 }}>Filtrar por local:</Text>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                      value={filtroLocalId}
                      onChange={(e) => aplicarFiltro((e.target as HTMLSelectElement).value)}
                      style={{
                          padding: 10,
                          borderRadius: 8,
                          border: `1px solid ${colors.inputBorder}`,
                          backgroundColor: colors.bgSecondary,
                          color: colors.textPrimary,
                          minWidth: 220
                      }}
                  >
                      <option value="">Todos</option>
                      {equipos.map((e: any) => (
                          <option key={e.id} value={e.id}>{e.nombre}</option>
                      ))}
                  </select>
                  {filtroLocalId && (
                    <button
                        onClick={limpiarFiltro}
                        style={{
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: 'none',
                            backgroundColor: colors.headerBg,
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Limpiar
                    </button>
                  )}
                </div>
            </View>

            {/* LISTA */}
            <FlatList
                data={partidos}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({item}) => (
                    <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.inputBorder }]}>
                        <Text style={[styles.cardText, { color: colors.textPrimary }]}>
                            #{item.id} — {item.equipoLocal?.nombre} <Text style={{color: colors.headerBg}}>{item.golesLocal}</Text> — <Text style={{color: colors.headerBg}}>{item.golesVisitante}</Text> {item.equipoVisitante?.nombre ?? '(sin visitante)'}
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

            {/* MENU DROPDOWN */}
            {mostrarMenu && (
                <View style={[styles.menu, { backgroundColor: colors.headerBgLight }]}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/'); setMostrarMenu(false); }}>
                        <Text style={{ color: '#fff' }}>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/equipos'); setMostrarMenu(false); }}>
                        <Text style={{ color: '#fff' }}>Equipos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMostrarMenu(false)}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Partidos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { router.push('/ranking'); setMostrarMenu(false); }}>
                        <Text style={{ color: '#fff' }}>Ranking</Text>
                    </TouchableOpacity>
                </View>
            )}
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
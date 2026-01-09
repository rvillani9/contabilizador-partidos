import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getApiBase } from './lib/apiBase';

export default function Home() {
    const base = getApiBase();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [seleccionado, setSeleccionado] = useState<any | null>(null);

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
                // IMPORTANTE: No llamamos a cargar() porque nos vamos de la pantalla
                setNombre('');
                setEmail('');
                continuar(u.id); // Pasamos el ID directamente
            })
            .catch((e) => {
                console.error(e);
                mostrarError('Error', 'No se pudo crear el usuario');
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}><Text style={styles.headerTitle}>Contabilizador</Text></View>

            <Text style={styles.sectionTitle}>Selecciona tu usuario</Text>

            {usuarios.length === 0 && <Text style={styles.empty}>No hay usuarios aún.</Text>}

            <FlatList
                data={usuarios}
                keyExtractor={u => String(u.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => seleccionar(item)}
                        style={[styles.card, seleccionado?.id === item.id && styles.cardSelected]}
                    >
                        <Text style={styles.cardTitle}>{item.nombre}</Text>
                        <Text style={styles.cardSubtitle}>{item.email}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={{ padding: 16 }}>
                <Button title="Continuar" onPress={() => continuar()} color="#0A84FF" />
            </View>

            <View style={styles.footer}>
                <Text style={styles.sectionTitle}>Crear nuevo</Text>
                <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                <Button title="Crear y Entrar" onPress={crear} color="#34C759" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#0A84FF', padding: 20, paddingTop: 50 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, paddingHorizontal: 16 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, marginHorizontal: 16 },
    empty: { color: '#666', textAlign: 'center', marginTop: 20 },
    card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
    cardSelected: { borderColor: '#0A84FF', backgroundColor: '#eaf4ff' },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 14, color: '#666' },
    footer: { paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', marginTop: 10 }
});
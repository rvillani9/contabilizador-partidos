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

    useEffect(() => {
        // Redirigir siempre a /login como pantalla inicial
        router.replace('/login');
    }, []);

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
            <Text style={{color: colors.textPrimary, padding: 16}}>Redirigiendo…</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 }
});
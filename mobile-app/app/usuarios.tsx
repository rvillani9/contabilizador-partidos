import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Usuarios() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, []);
  return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Redirigiendo…</Text></View>;
}

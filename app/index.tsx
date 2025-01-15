import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo à Sua Agenda</Text>
      <Button mode="contained" onPress={() => router.push('/calendario')}>
        Ver Agenda
      </Button>
      <Button mode="contained" onPress={() => router.push('/eventos')} style={styles.button}>
        Ver Eventos
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3c4554',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'white',
  },
  button: {
    marginTop: 10,
  },
});

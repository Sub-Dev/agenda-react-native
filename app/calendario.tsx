import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function Calendario() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [event, setEvent] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  // Pedir permissão para notificações
  React.useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'As notificações não funcionarão corretamente.');
      }
    })();
  }, []);

  const handleAddEvent = async () => {
    if (!selectedDate || !time || !event) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const timeParts = time.split(':');
    if (timeParts.length !== 2 || isNaN(parseInt(timeParts[0])) || isNaN(parseInt(timeParts[1]))) {
      Alert.alert('Erro', 'Hora inválida. Use o formato HH:MM.');
      return;
    }

    const eventDate = new Date(`${selectedDate}T${time}:00`);
    if (eventDate <= new Date()) {
      Alert.alert('Erro', 'A data e hora devem ser no futuro.');
      return;
    }

    // Agendar notificação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Evento',
        body: `Evento: ${event} às ${time}`,
      },
      trigger: eventDate,
    });

    Alert.alert('Sucesso', 'Evento adicionado e notificação agendada!');

    // Marcar a data no calendário
    setMarkedDates((prevDates) => ({
      ...prevDates,
      [selectedDate]: { marked: true, dotColor: 'blue', activeOpacity: 0 },
    }));

    setEvent('');
    setTime('');
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, dotColor: 'blue' },
        }}
      />
      <TextInput
        label="Hora (HH:MM)"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Descrição do Evento"
        value={event}
        onChangeText={setEvent}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddEvent}>
        Adicionar Evento
      </Button>
      <Button mode="contained" onPress={() => router.push('/')} style={styles.button}>
        Voltar ao Menu
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});

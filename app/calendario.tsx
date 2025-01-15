import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import styles from './styles';

interface Event {
  id: string;
  time: string;
  description: string;
  notificationId?: string;
}

interface Events {
  [date: string]: Event[];
}

export default function Calendario() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [event, setEvent] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState<Events>({});
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'As notificações não funcionarão corretamente.');
      }
    })();
  }, []);

  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem('events');
      const savedMarkedDates = await AsyncStorage.getItem('markedDates');

      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
      if (savedMarkedDates) {
        setMarkedDates(JSON.parse(savedMarkedDates));
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const handleConfirmTime = (selectedTime: Date) => {
    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
    setTimePickerVisible(false);
  };

  const handleAddOrUpdateEvent = async () => {
    if (!selectedDate || !time || !event) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const eventDate = new Date(`${selectedDate}T${time}:00Z`);
    if (eventDate <= new Date()) {
      Alert.alert('Erro', 'A data e hora devem ser no futuro.');
      return;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Evento',
          body: `Evento: ${event} às ${time}`,
        },
        trigger: eventDate,
      });

      console.log('Notificação agendada com ID:', notificationId);

      const newMarkedDates = {
        ...markedDates,
        [selectedDate]: {
          marked: true,
          dotColor: 'blue',
          activeOpacity: 0,
          selected: true,
          selectedBackgroundColor: 'rgba(144, 238, 144, 0.5)',
        },
      };

      const newEvents = {
        ...events,
        [selectedDate]: [
          ...(events[selectedDate] || []),
          {
            id: editEventId || uuid.v4(),
            time,
            description: event,
            notificationId,
          },
        ],
      };

      await AsyncStorage.setItem('events', JSON.stringify(newEvents));
      await AsyncStorage.setItem('markedDates', JSON.stringify(newMarkedDates));

      setMarkedDates(newMarkedDates);
      setEvents(newEvents);
      setEvent('');
      setTime('');
      setEditEventId(null);

      Alert.alert('Sucesso', 'Evento adicionado/atualizado e notificação agendada!');
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      Alert.alert('Erro', 'Não foi possível agendar a notificação.');
    }
  };

  const handleEditEvent = (eventToEdit: Event) => {
    setSelectedDate(eventToEdit.id.split('T')[0]);
    setTime(eventToEdit.time);
    setEvent(eventToEdit.description);
    setEditEventId(eventToEdit.id);
  };

  const handleRemoveEvent = async (eventId: string, date: string) => {
    const updatedEvents = { ...events };
    updatedEvents[date] = updatedEvents[date]?.filter((e) => e.id !== eventId);

    const eventToRemove = updatedEvents[date]?.find((e) => e.id === eventId);
    if (eventToRemove?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(eventToRemove.notificationId);
    }

    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>
        {item.time} - {item.description}
      </Text>
      <View style={styles.eventActions}>
        <Button mode="contained" onPress={() => handleEditEvent(item)} style={styles.editButton}>
          Editar
        </Button>
        <Button mode="contained" onPress={() => handleRemoveEvent(item.id, selectedDate)} style={styles.removeButton}>
          Remover
        </Button>
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'calendar', value: 'calendar' }, { key: 'form', value: 'form' }, { key: 'events', value: 'events' }]} // Adicionei uma chave fictícia para cada seção
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
        switch (item.value) {
          case 'calendar':
            return (
              <View style={styles.calendarWrapper}>
                <Calendar
                  onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                  markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, marked: true, dotColor: 'blue' },
                  }}
                />
              </View>
            );
          case 'form':
            return (
              <View>
                <TouchableOpacity onPress={() => setTimePickerVisible(true)} style={styles.timeButton}>
                  <Image source={require('../assets/icon-more.png')} style={styles.icon} />
                  <Text style={styles.timeText}>{time ? `Hora Selecionada: ${time}` : 'Selecionar Hora'}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleConfirmTime}
                  onCancel={() => setTimePickerVisible(false)}
                />
                <TextInput
                  label="Descrição do Evento"
                  value={event}
                  onChangeText={setEvent}
                  style={styles.input}
                />
                <Button mode="contained" onPress={handleAddOrUpdateEvent}>
                  {editEventId ? 'Atualizar Evento' : 'Adicionar Evento'}
                </Button>
                <Button mode="contained" onPress={() => router.push('/')} style={styles.button}>
                  Voltar ao Menu
                </Button>
              </View>
            );
          case 'events':
            return (
              <FlatList
                data={events[selectedDate] || []}
                keyExtractor={(item) => item.id}
                renderItem={renderEvent}
                ListHeaderComponent={() => (
                  <Text style={styles.eventHeader}>Eventos do Dia {selectedDate}</Text>
                )}
                style={styles.eventList}
              />
            );
          default:
            return null;
        }
      }}
      contentContainerStyle={{ flexGrow: 1 }} // Garantir que o conteúdo cresça e ocupe toda a tela
    />
  );
}



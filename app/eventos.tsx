import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';  // Importando os estilos

interface Event {
  id: string;
  date: string;
  time: string;
  description: string;
}

export default function Eventos() {
  const router = useRouter();
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem('events');
      if (savedEvents) {
        const events = JSON.parse(savedEvents);
        const eventArray: Event[] = [];

        for (const date in events) {
          events[date].forEach((event: Omit<Event, 'date'>) => {
            eventArray.push({ ...event, date });
          });
        }

        eventArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setAllEvents(eventArray);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const handleEditEvent = (event: Event) => {
    router.push(`/editarEvento/${event.id}`);
  };

  const handleRemoveEvent = async (eventId: string, date: string) => {
    try {
      const savedEvents = await AsyncStorage.getItem('events');
      const events = savedEvents ? JSON.parse(savedEvents) : {};
      const updatedEvents = { ...events };

      // Remove the event
      updatedEvents[date] = updatedEvents[date]?.filter((e: Event) => e.id !== eventId);

      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      loadEvents();  // Reload events after removal
    } catch (error) {
      console.error('Erro ao remover evento:', error);
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>{item.date} - {item.time} - {item.description}</Text>
      <View style={styles.eventActions}>
        <Button
          mode="contained"
          onPress={() => handleEditEvent(item)}
          style={styles.editButton}>
          Editar
        </Button>
        <Button
          mode="contained"
          onPress={() => handleRemoveEvent(item.id, item.date)}
          style={styles.removeButton}>
          Remover
        </Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eventHeader}>Todos os Eventos</Text>
      <FlatList
        data={allEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        style={styles.eventList}
      />
      <Button mode="contained" onPress={() => router.push('/')} style={styles.button}>
        Voltar ao Menu
      </Button>
    </View>
  );
}

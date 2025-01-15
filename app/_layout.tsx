import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3c4554',
        },
        headerTintColor: '#fff',
        contentStyle: {
          backgroundColor: '#3c4554',
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home"
        }}
      />
      <Stack.Screen
        name="calendario"
        options={{
          title: "Agenda"
        }}
      />
      <Stack.Screen
        name="eventos"
        options={{
          title: "Eventos"
        }}
      />
    </Stack>
  );
}

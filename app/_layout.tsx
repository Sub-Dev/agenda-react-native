import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="splash"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3c4554',
        },
        headerTintColor: '#fff',
        contentStyle: {
          backgroundColor: '#3c4554',
        },
      }}
    >
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="calendario"
        options={{
          title: "Agenda",
        }}
      />
      <Stack.Screen
        name="eventos"
        options={{
          title: "Eventos",
        }}
      />
    </Stack>
  );
}

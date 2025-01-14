import { Stack } from 'expo-router';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="calendario" />
    </Stack>
  );
}

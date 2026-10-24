import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          title: 'Cinema Billboard',
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Cartelera',
        }}
      />
      <Stack.Screen
        name="add-movie"
        options={{
          presentation: 'modal',
          title: 'Agregar Película',
        }}
      />
    </Stack>
  );
}

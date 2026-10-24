import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'All Movies' }} />
      <Tabs.Screen name="categories" options={{ title: 'By Categories' }} />
    </Tabs>
  );
}

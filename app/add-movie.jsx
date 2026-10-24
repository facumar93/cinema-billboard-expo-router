import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import useFetch from '../hooks/useFetch';
import { API_URL } from '../utils/api';
import CategoriesDropDown from '../components/CategoriesDropDown';

export default function AddMovie() {
  const { data: categories } = useFetch(`${API_URL}/categories`);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = async () => {
    // 1. Todos los campos llenos
    if (!title || !poster || !description || !duration || !rating || !selectedCategory) {
      Alert.alert('Faltan datos', 'Completá todos los campos.');
      return;
    }

    // 2. Convertir texto a número
    const durationNumber = Number(duration);
    const ratingNumber = Number(rating);

    // 3. Duración: entero mayor que 0
    if (!Number.isInteger(durationNumber) || durationNumber <= 0) {
      Alert.alert('Duración inválida', 'Ingresá los minutos como número entero.');
      return;
    }

    // 4. Calificación: número entre 0 y 10
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 10) {
      Alert.alert('Calificación inválida', 'Debe ser un número entre 0 y 10.');
      return;
    }

    // 5. Armar la película y mandarla a la API
    const newMovie = {
      title,
      poster,
      description,
      duration: durationNumber,
      rating: ratingNumber,
      category: selectedCategory,
    };

    try {
      const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      Alert.alert('Listo', 'Película agregada.');
      router.back();
    } catch (err) {
      console.error('Error al agregar película:', err);
      Alert.alert('Error', 'No se pudo agregar la película.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
        <TextInput placeholder="Poster URL" style={styles.input} value={poster} onChangeText={setPoster} />
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          placeholder="Duration (minutes)"
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Rating (0-10)"
          style={styles.input}
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />
      </ScrollView>

      <CategoriesDropDown
        categories={categories ?? []}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  form: {
    maxHeight: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

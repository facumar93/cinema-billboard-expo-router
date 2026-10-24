import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useState } from 'react';
import CategoriesDropDown from './CategoriesDropDown';

export default function AddMovieModal({ visible, onClose, onSubmit, categories }) {
  
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

    // 5. Todo bien: armar la película con los tipos correctos
    const newMovie = {
      title,
      poster,
      description,
      duration: durationNumber,
      rating: ratingNumber,
      category: selectedCategory,
    };
    const ok = await onSubmit(newMovie);

    if (ok) {
      setTitle('');
      setPoster('');
      setDescription('');
      setDuration('');
      setRating('');
      setSelectedCategory(null);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Movie</Text>

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
            categories={categories}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  form: {
    maxHeight: 300,
  },
});

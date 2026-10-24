import { Dimensions, Pressable, FlatList, StyleSheet, Text, View, Alert } from 'react-native';
import Movie from '../components/Movie';

import AddMovieFloatingButton from '../components/AddMovieFloatingButton';
import SegmentControl from '../components/SegmentControl';
import AddMovieModal from '../components/AddMovieModal';
import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../utils/api';
import { router } from 'expo-router';



export default function Dashboard() {

  const { data: movies, loading: loadingMovies, error: errorMovies, fetchData: refetchMovies } = useFetch(`${API_URL}/movies`);
  const { data: categories, loading: loadingCategories, error: errorCategories } = useFetch(`${API_URL}/categories`);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(0);

  const insets = useSafeAreaInsets();

  const handleAddMovie = async (newMovie) => {
    try {
      const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      Alert.alert('Listo', 'Película agregada.');
      await refetchMovies();
      setModalVisible(false);
      return true;
    } catch (err) {
      console.error('Error al agregar película:', err);
      Alert.alert('Error', 'No se pudo agregar la película.');
      return false;
    }
  };

  if (loadingMovies || loadingCategories) return <Text>Cargando...</Text>;
  if (errorMovies || errorCategories) return <Text>Error al cargar los datos</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <SegmentControl
        segments={['All Movies', 'Movies By Category']}
        selectedSegment={selectedSegment}
        onSegmentSelect={setSelectedSegment}
        style={{ width: Dimensions.get('window').width - 20 }}
      />
      
      {selectedSegment === 0 ? (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/movie/${item.id}`)}>
                <Movie
                  title={item.title}
                  poster={item.poster}
                  description={item.description}
                  rating={item.rating}
                  duration={item.duration}
                />
              </Pressable>
          )}
          />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(category) => category.id}
            renderItem={({ item: category }) => (
              <View>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <FlatList
                  horizontal
                  data={movies.filter((movie) => movie.category === category.name)}
                  keyExtractor={(movie) => movie.id}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/movie/${item.id}`)}>
                      <Movie
                        title={item.title}
                        poster={item.poster}
                        description={item.description}
                        rating={item.rating}
                        duration={item.duration}
                      />
                    </Pressable>
                  )}
                />
              </View>
            )}
          />
        )
      }
            
      <AddMovieFloatingButton
        style={{
          position: 'absolute',
          bottom: 20 + insets.bottom,
          right: 20,
        }}
        onPress={() => {
          console.log('Add Movie Pressed');

          setModalVisible(true);
        }}
      />
      <AddMovieModal
        categories={categories}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddMovie}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF2400',
    textAlign: 'center',
    marginVertical: 10,
  },
});

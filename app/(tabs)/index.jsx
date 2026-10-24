import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../utils/api';
import Movie from '../../components/Movie';
import AddMovieFloatingButton from '../../components/AddMovieFloatingButton';

export default function AllMovies() {
  const { data: movies, loading, error, fetchData } = useFetch(`${API_URL}/movies`);

  // Cada vez que la pestaña vuelve a verse (por ejemplo, al cerrar /add-movie),
  // vuelve a pedir las películas para mostrar las nuevas.
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los datos</Text>;

  return (
    <View style={styles.container}>
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
      <AddMovieFloatingButton
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        onPress={() => router.push('/add-movie')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

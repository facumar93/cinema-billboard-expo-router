import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../utils/api';
import Movie from '../../components/Movie';
import AddMovieFloatingButton from '../../components/AddMovieFloatingButton';

export default function ByCategories() {
  const { data: movies, loading: loadingMovies, error: errorMovies, fetchData: refetchMovies } = useFetch(`${API_URL}/movies`);
  const { data: categories, loading: loadingCategories, error: errorCategories } = useFetch(`${API_URL}/categories`);

  // Cada vez que la pestaña vuelve a verse, vuelve a pedir las películas.
  // Las categorías no cambian, así que no hace falta pedirlas de nuevo.
  useFocusEffect(
    useCallback(() => {
      refetchMovies();
    }, [refetchMovies])
  );

  if (loadingMovies || loadingCategories) return <Text>Cargando...</Text>;
  if (errorMovies || errorCategories) return <Text>Error al cargar los datos</Text>;

  return (
    <View style={styles.container}>
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
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF2400',
    textAlign: 'center',
    marginVertical: 10,
  },
});

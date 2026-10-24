import { FlatList, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import useFetch from '../../hooks/useFetch';
import { API_URL } from '../../utils/api';
import Movie from '../../components/Movie';
import { getRatingStars } from '../../utils/formatters';
import { Image } from 'expo-image';

export default function MovieDetails() {
    const { id } = useLocalSearchParams();
    const { data: movie, loading, error } = useFetch(`${API_URL}/movies/${id}`);

    if (loading) return <Text>Cargando...</Text>;
    if (error) return <Text>Error al cargar la película</Text>;

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: movie.title }} />
            <Movie
                title={movie.title}
                poster={movie.poster}
                description={movie.description}
                rating={movie.rating}
                duration={movie.duration}
            />
            <Text>Categoría: {movie.category}</Text>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            {movie.reviews?.length ? (
                <FlatList
                    horizontal
                    data={movie.reviews}
                    keyExtractor={(review, index) => String(index)}
                    renderItem={({ item: review }) => (
                        <View style={styles.reviewCard}>
                            <Image
                                source={require('../../assets/profile-circle-svgrepo-com.svg')}
                                style={styles.avatar}
                            />
                            <Text style={styles.reviewUser}>{review.username}</Text>
                            <Text>{getRatingStars(review.rating)}</Text>
                            <Text>{review.review}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>Aún no hay reviews para esta película</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    reviewsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    reviewCard: {
        width: 200,
        marginLeft: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    reviewUser: {
        fontWeight: 'bold',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'center',
        marginBottom: 6,
    },
});
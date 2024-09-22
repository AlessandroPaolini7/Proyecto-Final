from nospeak_app.recommendations.generate_cosine_sim import count_matrix
from nospeak_app.recommendations.generate_cosine_sim import data_songs
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sklearn.preprocessing import normalize


def get_vector_for_track(trackname):
    idx = list(data_songs.index[data_songs['Track Name'] == trackname])[0]
    return count_matrix[idx]

def get_recommendations_for_vector(track_vector):
    if track_vector.ndim == 1:
        track_vector = track_vector.reshape(1, -1)
    # Normalizar el vector
    track_vector = normalize(track_vector)
    cosine_similarities = cosine_similarity(track_vector, count_matrix).flatten()
    score_series = pd.Series(cosine_similarities).sort_values(ascending=False)
    recommended_songs = []

    unique_track_names = set()

    for i in score_series.index:
        current_track_name = data_songs.loc[i, 'Track Name']
        current_artist = data_songs.loc[i, 'Artist']

        if current_track_name not in unique_track_names:
            recommended_songs.append({
                "titulo": current_track_name,
                "artista": current_artist
            })
            unique_track_names.add(current_track_name)

        if len(recommended_songs) == 10:
            break

    return recommended_songs


def multi_recommendations(tracks_with_scores):
    # Si tracknames está vacío, devolver 10 canciones aleatorias
    if not tracks_with_scores:  # Verifica si tracks_with_scores está vacío
        random_songs = data_songs[["Track Name", "Artist"]].drop_duplicates().sample(n=10).to_numpy()
        return [
            {"titulo": song[0], "artista": song[1]}
            for song in random_songs
        ]

    weighted_vectors = []
    total_score = 0

    for track in tracks_with_scores:
        trackname = track["trackname"]
        score = track["score"]
        vector = np.asarray(get_vector_for_track(trackname).todense())

        if not np.isnan(vector).any():
            vector = normalize(vector)
            weighted_vectors.append(vector * score)
            total_score += score

    avg_vector = np.sum(weighted_vectors, axis=0)

    if total_score != 0:
        avg_vector = avg_vector / total_score
    else:
        avg_vector = np.zeros_like(avg_vector)


    if avg_vector.ndim == 1:
        avg_vector = avg_vector.reshape(1, -1)
    elif avg_vector.ndim == 0:
        avg_vector = np.array([[avg_vector]])

    recommended_songs = get_recommendations_for_vector(avg_vector)

    # Eliminar duplicados y completar con canciones aleatorias
    unique_track_names = set([track["trackname"] for track in tracks_with_scores])
    unique_recommended_songs = []
    for song in recommended_songs:
        if song["titulo"] not in unique_track_names:
            unique_recommended_songs.append(song)
            unique_track_names.add(song["titulo"])
            if len(unique_recommended_songs) == 10:
                break

    # Si hay menos de 10 canciones, completar con canciones aleatorias
    if len(unique_recommended_songs) < 10:
        remaining_count = 10 - len(unique_recommended_songs)
        all_tracks = data_songs[["Track Name", "Artist"]].drop_duplicates()

        # Filtrar las canciones que ya están en unique_track_names
        remaining_songs = all_tracks[~all_tracks["Track Name"].isin(unique_track_names)]

        # Seleccionar aleatoriamente las canciones restantes
        random_songs = remaining_songs.sample(n=remaining_count).to_numpy()

        for song in random_songs:
            unique_recommended_songs.append({
                "titulo": song[0],  # 'Track Name' en la primera columna
                "artista": song[1]  # 'Artist' en la segunda columna
            })

    # Si no hay ninguna canción recomendada, completar las 10 canciones con canciones aleatorias
    if len(unique_recommended_songs) == 0:
        random_songs = data_songs[["Track Name", "Artist"]].drop_duplicates().sample(n=10).to_numpy()
        for song in random_songs:
            unique_recommended_songs.append({
                "titulo": song[0],
                "artista": song[1]
            })

    print(f"Unique recommended songs: {unique_recommended_songs}")

    return unique_recommended_songs

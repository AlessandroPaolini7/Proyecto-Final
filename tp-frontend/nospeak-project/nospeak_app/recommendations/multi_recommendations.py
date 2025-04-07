from nospeak_app.recommendations.generate_cosine_sim import count_matrix
from nospeak_app.recommendations.generate_cosine_sim import data_songs
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sklearn.preprocessing import normalize


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


def get_vector_for_track(trackname):
    matching_songs = data_songs.index[data_songs['Track Name'] == trackname]
    if len(matching_songs) == 0:
        print(f"Warning: Song '{trackname}' not found in database")
        return None
    return count_matrix[matching_songs[0]]

def multi_recommendations(tracks_with_scores):
    # If tracknames is empty, return 10 random songs
    if not tracks_with_scores:
        random_songs = data_songs[["Track Name", "Artist"]].drop_duplicates().sample(n=10).to_numpy()
        return [
            {"titulo": song[0], "artista": song[1]}
            for song in random_songs
        ]

    weighted_vectors = []
    total_score = 0
    valid_tracks = []

    for track in tracks_with_scores:
        trackname = track["trackname"]
        score = track["score"]
        vector = get_vector_for_track(trackname)
        
        if vector is not None:
            vector = np.asarray(vector.todense())
            if not np.isnan(vector).any():
                vector = normalize(vector)
                weighted_vectors.append(vector * score)
                total_score += score
                valid_tracks.append(track)
        else:
            print(f"Skipping track '{trackname}' as it was not found in the database")

    # If no valid tracks were found, return random recommendations
    if not weighted_vectors:
        print("No valid tracks found. Returning random recommendations.")
        random_songs = data_songs[["Track Name", "Artist"]].drop_duplicates().sample(n=10).to_numpy()
        return [
            {"titulo": song[0], "artista": song[1]}
            for song in random_songs
        ]

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

    # Remove duplicates and fill with random songs
    unique_track_names = set([track["trackname"] for track in valid_tracks])
    unique_recommended_songs = []
    
    for song in recommended_songs:
        if song["titulo"] not in unique_track_names:
            unique_recommended_songs.append(song)
            unique_track_names.add(song["titulo"])
            if len(unique_recommended_songs) == 10:
                break

    # If less than 10 songs, fill with random songs
    if len(unique_recommended_songs) < 10:
        remaining_count = 10 - len(unique_recommended_songs)
        all_tracks = data_songs[["Track Name", "Artist"]].drop_duplicates()
        remaining_songs = all_tracks[~all_tracks["Track Name"].isin(unique_track_names)]
        random_songs = remaining_songs.sample(n=remaining_count).to_numpy()

        for song in random_songs:
            unique_recommended_songs.append({
                "titulo": song[0],
                "artista": song[1]
            })

    return unique_recommended_songs
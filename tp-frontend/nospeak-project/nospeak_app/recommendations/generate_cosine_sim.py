import os
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

script_dir = os.path.dirname(__file__)

csv_file_path = os.path.join(script_dir, 'data_songs.csv')

data_songs = pd.read_csv(csv_file_path)

count = CountVectorizer()
count_matrix = count.fit_transform(data_songs['Genre'])


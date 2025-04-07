const Song = require('../models/song');
const User = require('../models/user');

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('artist');
    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

  exports.createSong = async (req, res) => {
    try {
      const {
        title,
        genre,
        artist,
      } = req.body;
      const user = await User.findById(req.userId);
      console.log(req.userId)
      // Verifica si el usuario es un artista
      if (user && !user.isArtist) {
        return res.status(401).json({ mensaje: 'Permissions are needed to create songs' });
      } else {
      const newSong = new Song({
        title,
        genre,
        artist,
      });

      await newSong.save();

      return res.status(201).json(newSong);
    }
    } catch (error) {
      return res.status(500).json({ mensaje: `Internal server error: ${error}`  });
    }
};

exports.getSongById = async (req, res) => {
  try {
    const songId = req.params.id;

    const song = await Song.findById(songId).populate('artist');

    if (!song) {
      return res.status(404).json({ mensaje: 'Song not found' });
    }

    return res.status(200).json(song);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};


exports.updateSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const {
      title,
      genre,
      artist,
    } = req.body;
  
  if(User.isArtist === false){
    return res.status(401).json({ mensaje: 'Permissions are needed to edit songs' });
  } else {
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      {
        title,
        genre,
        artist,
      },
      { new: true }
    ).populate('artist');

    if (!updatedSong) {
      return res.status(404).json({ mensaje: 'Song not found' });
    }

    return res.status(200).json(updatedSong);
  }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};


exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;

    if (User.isArtist === false) {
      return res.status(401).json({ mensaje: 'Permissions are needed to delete songs' });
    } else {
    const result = await Song.findByIdAndRemove(songId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Song not found' });
    }


    return res.status(200).json({ mensaje: 'Song deleted successfully' });
  }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};


exports.getSongsByArtist = async (req, res) => {
  try {
    const { artist_id } = req.params;

    const songs = await Song.find({ artist: artist_id })
      .populate('artist');   

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSongsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const songs = await Song.find({ genre })
      .populate('artist');

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
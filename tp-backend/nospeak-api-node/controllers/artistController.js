const Artist = require('../models/artist');

exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

exports.createArtist = async (req, res) => {
  try {
    const { name, nationality, followers, picture } = req.body;

    console.log(req.body);

    const newArtist = new Artist({
      name, 
      nationality, 
      followers, 
      picture,
    });

    await newArtist.save();

    return res.status(201).json(newArtist);
  } catch (error) {
    return res.status(500).json({ mensaje: `Internal server error: ${error}` });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artistId = req.params.id;

    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ mensaje: 'Artist not found' });
    }

    return res.status(200).json(artist);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const { name, nationality, followers, picture } = req.body;

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      {
        name, 
        nationality, 
        followers, 
        picture,
      },
      { new: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({ mensaje: 'Artist not found' });
    }

    return res.status(200).json(updatedArtist);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error' });
  }
};


exports.deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;

    const result = await Artist.findByIdAndRemove(artistId);

    if (!result) {
      return res.status(404).json({ mensaje: 'Artist not found' });
    }

    return res.status(200).json({ mensaje: 'Artista deleted successfully' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Internal server error'});
  }
};

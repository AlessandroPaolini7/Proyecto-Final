const Collection = require('../models/collection');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { title, description, creation_date, songs, user, picture } = req.body;

    const newCollection = new Collection({
      title, 
      description, 
      creation_date, 
      songs, 
      user, 
      picture
    });

    await newCollection.save();

    res.status(201).json({ message: 'Collection created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId).populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const { title, description, creation_date, songs, user, picture } = req.body;

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { title, description, creation_date, songs, user, picture },
      { new: true }
    ).populate('songs user');

    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const result = await Collection.findByIdAndRemove(collectionId);

    if (!result) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCollectionsByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const collections = await Collection.find({ user: userId }).populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');

    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

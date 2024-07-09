const ListenList = require('../models/listenList');

exports.getListenLists = async (req, res) => {
  try {
    const listenLists = await ListenList.find().populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');
    res.status(200).json(listenLists);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createListenList = async (req, res) => {
  try {
    const { title, description, creation_date, songs, user} = req.body;

    const newListenList = new ListenList({
      title, 
      description, 
      creation_date, 
      songs, 
      user,
    });

    await newListenList.save();

    res.status(201).json({ message: 'Listen list created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getListenListById = async (req, res) => {
  try {
    const listenListId = req.params.id;
    const listenList = await ListenList.findById(listenListId).populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');

    if (!listenList) {
      return res.status(404).json({ message: 'Listen list not found' });
    }

    res.status(200).json(listenList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateListenList = async (req, res) => {
  try {
    const listenListId = req.params.id;
    const { title, description, creation_date, songs, user } = req.body;

    const updatedListenList = await ListenList.findByIdAndUpdate(
      listenListId,
      { title, description, creation_date, songs, user},
      { new: true }
    ).populate('songs user');

    if (!updatedListenList) {
      return res.status(404).json({ message: 'Listen list not found' });
    }

    res.status(200).json(updatedListenList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteListenList = async (req, res) => {
  try {
    const listenListId = req.params.id;
    const result = await ListenList.findByIdAndRemove(listenListId);

    if (!result) {
      return res.status(404).json({ message: 'Listen list not found' });
    }

    res.status(200).json({ message: 'Listen list deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getListenListsByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const listenLists = await ListenList.find({ user: userId }).populate({
      path: 'songs',
      populate: { path: 'artist' }
    }).populate('user');

    res.status(200).json(listenLists);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

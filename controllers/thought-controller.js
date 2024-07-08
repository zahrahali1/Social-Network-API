const { Thought, User} = require('../models');

const ThoughtController = {
    async getThoughts(req, res) {
        try {
          const thoughts = await Thoughts.find()
          .populate('students');
          res.json(thoughts);
        } catch (err) {
          res.status(500).json(err);
        }
    }
}
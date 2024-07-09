const { User, Thought } = require('../models');

module.exports = {
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $push: { thoughts: newThought._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(201).json(newThought);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error creating thought', error: err });
        }
    },

    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find({}).select('-__v');
            res.json(thoughts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving thoughts', error: err });
        }
    },

    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId).select('-__v');
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thought);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving thought', error: err });
        }
    },

    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true, runValidators: true });
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating thought', error: err });
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            const user = await User.findByIdAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
            res.json({ message: 'Thought deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting thought', error: err });
        }
    },

    async addReaction(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error adding reaction', error: err });
        }
    },

    async deleteReaction(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error removing reaction', error: err });
        }
    }
};
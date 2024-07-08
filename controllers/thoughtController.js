const { Thought, User } = require('../models');

const thoughtController = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find().populate('reactions');
            res.json(thoughts);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch thoughts', error: err.message });
        }
    },

    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findById(req.params.id).populate('reactions');
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch thought', error: err.message });
        }
    },

    async createThought(req, res) {
        try {
            const { thoughtText, username } = req.body;
            const thought = await Thought.create({ thoughtText, username });
            await User.updateOne({ _id: thought.userId }, { $push: { thoughts: thought._id } });
            res.status(201).json(thought);
        } catch (err) {
            res.status(500).json({ message: 'Failed to create thought', error: err.message });
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json({ message: 'Failed to update thought', error: err.message });
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.id);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            await User.updateOne({ _id: thought.userId }, { $pull: { thoughts: thought._id } });
            res.json({ message: 'Thought deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete thought', error: err.message });
        }
    },

    async addReaction(req, res) {
        try {
            const { reactionBody, username } = req.body;
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: { reactionBody, username } } },
                { new: true, runValidators: true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            res.status(500).json({ message: 'Failed to add reaction', error: err.message });
        }
    },

    async deleteReaction(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { new: true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(updatedThought);
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete reaction', error: err.message });
        }
    }
};

module.exports = thoughtController;

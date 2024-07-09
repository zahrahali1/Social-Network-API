const { User, Thought } = require('../models');

module.exports = {
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error creating user', error: err });
        }
    },

    async getUsers(req, res) {
        try {
            const users = await User.find({}).select('-__v');
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving users', error: err });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id)
                .select('-__v')
                .populate('thoughts')
                .populate('friends');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving user', error: err });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating user', error: err });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting user', error: err });
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error adding friend', error: err });
        }
    },

    async deleteFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error removing friend', error: err });
        }
    },
};
const { User, Thought } = require('../models');

const userController = {
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while creating the user', error });
        }
    },

    async getUsers(req, res) {
        try {
            const users = await User.find({}).select('-__v');
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while retrieving users', error });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id })
                .select('-__v')
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user found with the provided ID' });
            }

            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while retrieving the user', error });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with the provided ID' });
            }

            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while updating the user', error });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'No user found with the provided ID' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
           
            await User.updateMany(
                { _id: { $in: user.friends } },
                { $pull: { friends: req.params.id } }
            );

            res.json({ message: 'User and their associated thoughts have been deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while deleting the user', error });
        }
    },

    async addFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (userId === friendId) {
                return res.status(400).json({ message: 'Cannot add yourself as a friend' });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId, friends: { $ne: friendId } }, 
                { $addToSet: { friends: friendId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with the provided ID or friend already added' });
            }

            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while adding the friend', error });
        }
    },

    async removeFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (userId === friendId) {
                return res.status(400).json({ message: 'Cannot remove yourself as a friend' });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { friends: friendId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with the provided ID or friend not found' });
            }

            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while removing the friend', error });
        }
    }
};

module.exports = userController;

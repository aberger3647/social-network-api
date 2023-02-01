const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const userCount = async() =>
    User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers)

// routes for /api/users/
module.exports = {
// get all users
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObj = {
                users,
                userCount: await userCount()
            };
            return res.json(userObj);
        })
         .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
         });
    },
// get a single user by _id, populated thought and friend data
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) =>
        !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json({ user })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
// post a new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
// put to update a user by _id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true }
        )
        .then(updatedUser => res.status(200).json(updatedUser))
        .catch(err => res.status(500).json(err))
    },
// delete to remove by _id
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => {
            console.log(user)
            return Thought.deleteMany({ _id: { $in: user.thoughts } })
        })
        .then(() => {
            console.log("##########")
            res.status(200).json({ message: 'User deleted and thoughts' })
        })
        .catch((err) => res.status(500).json(err));
    },
// routes for /api/users/:userId/friends/:friendId
// post to add new friend to user's friend list
    addFriend(req, res) {
        User.findOneAndUpdate(req.params.userId)
        .then((user) => {
            return User.create(
                { username: req.body.username },
                { email: req.body.email }
                )
        })
        .catch(err => res.status(500).json(err))   
    },
// delete to remove friend from friend list
    deleteFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId })
        .then((user) => {
            !user
            ? res.status(404).json({ message: 'No user found with that ID' })
            : res.json('Deleted from friend list')
        })
        .catch(err => res.status(500).json(err))   
    }
};
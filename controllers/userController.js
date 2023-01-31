const { ObjectId } = require('mongoose').Types;
const { User } = require('../models');

// routes for /api/users/
module.exports = {
// get all users
    getUsers(req, res) {
        User.find()
        .then(async (users) => res.json(users))
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
    }
// put to update a user by _id

// delete to remove by _id

// bonus: remove user's associated thoughts when deleted

// routes for /api/users/:userId/friends/:friendId

// post to add new friend to user's friend list

// delete to remove friend from friend list
};
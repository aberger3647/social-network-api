const { ObjectId } = require('mongoose').Types;
const { Thought, User, Reaction } = require('../models');

const thoughtCount = async() => 
    Thought.aggregate()
    .count('thoughtCount')
    .then((numberOfThoughts) => numberOfThoughts);

module.exports = {
// get all thoughts
    getThoughts(req, res) {
        Thought.find()
        .then(async (thoughts) => {
        const thoughtObj = {
            thoughts,
            thoughtCount: await thoughtCount(),
        };
        return res.json(thoughtObj);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
    },
// get one thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
        !thought 
        ? res.status(404).json({ message: 'No thought with that ID'}) 
        : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err)
        })
    },
// create new thought - push thought's _id to user's thoughts array
    createThought(req,res) {
        Thought.create(req.body)
        .then((thought) => {  
            return User.findOneAndUpdate( 
            { username: thought.username },
            { $addToSet: { thoughts: thought._id } },
            { new: true })
        })
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'Thought created, but found no user with that ID' })
        : res.json('Created thought'))
        .catch((err) => res.status(500).json(err));
    },
// update thought by _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { thoughtText: req.body.thoughtText },
            { new: true })
        .then(updatedThought => res.status(200).json(updatedThought))
        .catch(err => res.status(500).json(err))
    },

// delete thought by _id
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

// routes for /api/thoughts/:thoughtId/reactions

// post to create reaction stored in a single thought's reactions array
// reaction should be in req.body
// update thought with what is in req.body
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((thought) => {
        !thought
            ? res.status(404).json({ message: 'No thought found with that ID' })
            : res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
    },
// delete by reactionId
// thoughtId/reactions/reactionId
// or have reactionId in req.body
    deleteReaction(req, res) {
        Thought.findOneAndUpdate( { _id: req.params.thoughtId })
        .then((thought) => {
            return Reaction.findOneAndDelete(
                { _id: reactionId }
            )
        })
        .catch(err => res.status(500).json(err))   
    }
};
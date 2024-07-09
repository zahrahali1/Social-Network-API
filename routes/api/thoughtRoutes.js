const router = require('express').Router();
const {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

router.route('/')
    .get(getThoughts);

router.route('/:userId')
    .post(createThought);

router.route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought);

router.route('/:thoughtId')
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(addReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;
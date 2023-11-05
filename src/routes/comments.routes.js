const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment  } = require('../controllers/comment.controler');

router.get('/comments/:gameId', getComments);
router.post('/comments', addComment);
router.delete('/comments/:commentId', deleteComment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/comment.controler');

router.get('/comments/:gameId', getComments);
router.post('/comments', addComment);

module.exports = router;

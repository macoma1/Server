const Comment = require("../models/comment");

exports.getComments = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const comments = await Comment.find({ gameId: gameId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments" });
  }
};

exports.addComment = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Error saving comment" });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

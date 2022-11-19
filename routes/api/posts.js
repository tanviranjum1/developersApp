const express = require('express');
const router = express.Router();

//bring in auth middleware annd express validator.
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
//bring in models.
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route GET api/posts is endpiont.
//@desc Test route.
//@access public. so doesn't need token. will make that happen by auth middleware.
// router.get('/', (req, res) => res.send('Posts route'));

//@route GET api/posts is endpiont.
//@desc Create a Post.
//@access Private. so doesn't need token. will make that happen by auth middleware.
// make request using userid that we have from th e token.
// text is going to be sent.
router.post(
  '/',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // to not get password.
      const user = await User.findById(req.user.id).select('-password');
      // name and avatar will coem from db.

      // initialize new post from teh model.
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      // after adding post. get back post as response.
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/posts is endpiont.
//@desc Get all posts.
//@access Private. have to login in to see post. will make that happen by auth middleware.
// make request using userid that we have from th e token.
// text is going to be sent.
router.get('/', auth, async (req, res) => {
  try {
    // -1 to get most recent first. 1 to get oldest.
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/posts/:id
//@desc Get post by id.
//@access Private. have to login in to see post by id.
// make request using userid that we have from th e token.
// text is going to be sent.
router.get('/:id', auth, async (req, res) => {
  try {
    //to get id from url.
    const post = await Post.findById(req.params.id);
    // check if there is a post with the id.
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // not valid objectId. same message if not true.
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).send('Server error');
  }
});

//@route DELETE  api/posts/:id
//@desc Delete a post.
//@access Private.
router.delete('/:id', auth, async (req, res) => {
  try {
    //to get id from url.
    const post = await Post.findById(req.params.id);

    // if post doesn't exist.
    // not valid objectId. same message if not true.
    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    // make sure user that deletes the post is the user that owns the pst.
    // Check User.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    // not valid objectId. same message if not true.
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    res.status(500).send('Server error');
  }
});

//@route PUT  api/posts/like/:id
//@desc Like a post.
//@access Private.
// when user clicks like it should add them to array. Put : updating a post.
router.put('/like/:id', auth, async (req, res) => {
  try {
    // pose model.
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by the user. higher order array method.
    // compare the current user to the user that's logged in.
    // >0 already a like in there that has the user.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    // put it on the begining.
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

//@route PUT  api/posts/like/:id
//@desc Unlike a post.
//@access Private.
// when user clicks like it should add them to array. Put : updating a post.
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    // pose model.
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by the user. higher order array method.
    // compare the current user to the user that's logged in.
    // >0 already a like in there that has the user.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    // Get remove index.
    // to get the like to remove.
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// route to add a comment to post.

//@route POST api/posts/comment/:id is endpiont.
//@desc Comment on a Post.
//@access Private. so doesn't need token. will make that happen by auth middleware.
// make request using userid that we have from th e token.
// text is going to be sent.
router.post(
  '/comment/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // to not get password.
      const user = await User.findById(req.user.id).select('-password');
      // name and avatar will coem from db.
      const post = await Post.findById(req.params.id);

      // initialize new post from teh model.
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      //add this to post comment.
      post.comments.unshift(newComment);

      await post.save();
      // after adding post. get back post as response.
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route POST api/posts/comment/:id/:comment_id is endpiont.
//@desc Delete Comment on a Post.
//@access Private.
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //get the post by id.
    const post = await Post.findById(req.params.id);

    // pull out comment from the post.
    // find takes in a function like foreach, map, filter
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure comment exists.
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // make sure user that deletes the comment is the user who made the comment.
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index.
    // to get the like to remove.
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

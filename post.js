const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/user');
// create a post 

router.post('/api/users/posts', async (req, res) => {
    const newPost = new Post(req.body)

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

// update a post

router.put('/api/users/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await Post.updateOne({ $set: req.body })
            res.json("post has been updated");
        } else {
            res.status(403).json("unAuthorized");
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})

// delete a post
router.delete('/api/users/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await Post.deleteOne()
            res.json("post has been deleted");
        } else {
            res.status(403).json("unAuthorized");
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})
// get a post

router.get("/api/users/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})
// like a post
router.put("/api/users/posts/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await Post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been liked");
        } else {
            await Post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("post has been unliked");
        }
    } catch (err) {

    }

})
// unlike a post
// get all following timeline posts

router.get("/api/users/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                Post.find({ userId: friendId});
            })
        )
        res.json(userPosts.concat(...friendPosts));
    }catch (err) {
        console.log(err);
    res.status(500).json(err);
    
}
})




module.exports = router;
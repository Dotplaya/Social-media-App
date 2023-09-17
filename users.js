const User = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');

// Update a user
router.put('/api/users/:id', async (req, res) => {
  try {
    // Check if the user is authorized to update the account
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      // If a password is provided, hash it before updating
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      // Update the user data
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true }); // Use { new: true } to get the updated user data

      res.status(200).json(updatedUser); // Return the updated user data
    } else {
      res.status(403).json("You can update only your account!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a user
router.delete('/api/users/:id', async (req, res) => {
  try {
    // Check if the user is authorized to delete the account
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      // Delete the user
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("Account has been deleted");
    } else {
      res.status(403).json("You can delete only your account!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a user
router.get('/api/users/:id', async(req, res) => {
  try{
      const user = await User.findById(req.params.id);
      const {password, updatedAt, email, ...other} = user._doc;
      res.status(200).json({other});
  }catch(err){
      console.log(err);
      res.status(500).json(err);
  }
})

  
router.put('/api/users/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { following: req.params.id } })
        res.status(200).json("following");
      } else {
        res.json("You already follow this user");
      }     
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("you cannot follow yourself")
  }
})


// Unfollow a user

router.put('/api/users/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { following: req.params.id } })
        res.status(200).json("unfollowed");
      } else {
        res.json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.json("you cannot unfollow yourself")
  }
})



module.exports = router;

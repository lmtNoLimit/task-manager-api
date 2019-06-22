const express = require("express");
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  readProfile,
  updateUser,
  deleteUser,
  uploadAvatar,
  deleteAvatar,
  getAvatar
} = require("../controllers/user");
const upload = require('../middleware/multer');

router.get("/profile", auth, readProfile);
router.patch("/profile", auth, updateUser);
router.delete("/profile", auth, deleteUser);
router.post('/profile/avatar', auth, upload.single('avatar'), uploadAvatar);
router.delete('/profile/avatar', auth, deleteAvatar);
router.get('/:id/avatar', getAvatar);

module.exports = router;

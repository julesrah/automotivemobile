const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
router.get(`/`, async (req, res) => {
  // const userList = await User.find();
  const userList = await User.find().select("-passwordHash");
  console.log(userList);

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// find user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

// create user
router.post('/', async (req, res)=>{
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  let password = await bcrypt.hashSync(req.body.password, salt)

  let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    passwordHash: password,
    address: req.body.address,
    section: req.body.section,
    phone: req.body.phone,
    // image: `${basePath}${fileName}`,
    role: req.body.role,
  });

  user = await user.save();

  if(!user)
  return res.status(400).send('the user cannot be created!')
  res.send(user);
});

// register or signup
router.post("/register", async (req, res) => {
  let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    section: req.body.section,
    phone: req.body.phone,
    // image: `${basePath}${fileName}`,
    role: req.body.role,
  });

  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

// update profile by customer
router.put("/:id", uploadOptions.single('fileFieldName'), async (req, res) => {
  // 'fileFieldName' should match the name attribute in your form

  const userFind = await User.findById(req.params.id);

  let newPassword;

  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userFind.passwordHash;
  }

  let newImage = userFind.image; // Initialize newImage variable

  if (req.file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    newImage = `${basePath}${fileName}`;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      passwordHash: newPassword,
      section: req.body.section,
      phone: req.body.phone,
      image: newImage,
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).send('The user cannot be updated');
  } else {
    res.send(user);
  }
});

//login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

router.put("/userProfile/:id", uploadOptions.single("image"), async (req, res) => {
  try {
    const userFind = await User.findById(req.params.id);

    console.log(req.params);
    let newImage;

    if (req.file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      newImage = `${basePath}${fileName}`;
    } else {
      newImage = userFind.image;
    }

    const updatedUser = {
      firstname: req.body.firstname || userFind.firstname,
      lastname: req.body.lastname || userFind.lastname,
      section: req.body.section || userFind.section,
      phone: req.body.phone || userFind.phone,
    
      image: newImage,
    };

    console.log(updatedUser, "user");

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "The user cannot be updated" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

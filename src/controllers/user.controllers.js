import { User } from "../models/users.model.js";

const registerUser = async (req, res) => {
  try {
    const { name, password, confirmPassword, email, profilePhoto, gender } = req.body;

    //If User doesn't provide any info.
    if (!name || !password || !confirmPassword || !email || !gender) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    if (gender !== "male" && gender !== "female") {
      return res.status(400).json({ message: "gender should be male or female" });
    }

    //If User doesn't give photo
    const profilePhotoAvatar = `https://avatar.iran.liara.run/username?username=${name}`;

    //If passwprd doesn't match with confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    //Check user exist or not
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    //Create User
    const user = await User.create({
      name,
      email,
      password,
      profilePhoto: !profilePhoto ? profilePhotoAvatar : profilePhoto,
      gender,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(`error from registerUser ${error.message}`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //If username and password are not given by user
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isPasswordMatch = user.matchPassword(password);
    const jwtToken = user.generateAccessToken();
    // console.log(jwtToken);

    if (isPasswordMatch) {
      return res
        .status(200)
        .cookie("token", jwtToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
        });
    } else {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(`Error from loginUser ${error.message}`);
  }
};

const allUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    console.log(`Error from allUser ${error.message}`);
  }
};

export { registerUser, loginUser, allUser };

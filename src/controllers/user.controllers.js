import { User } from "../models/users.model.js";

const registerUser = async (req, res) => {
  try {
    const { name, password, confirmPassword, email, profilePhoto, gender } = req.body;

    //If User doesn't provide any info.
    if (!name || !password || !confirmPassword || !email || !gender) {
      return res.status(400).json({ message: "All Fields are required" });
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
    const user = await User.findOne({ email });
    console.log(user);
  } catch (error) {
    console.log(`Error from loginUser ${error.message}`);
  }
};

export { registerUser, loginUser };

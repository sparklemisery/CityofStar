const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken")


const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log("email : " + email)
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("nothing on you");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('email have already existed')
    }
    const user = await User.create({
        name, email, password, pic,
    })

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });

    } else {
        res.status(400);
        throw new Error("user not found");
    }
}

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    try {
        if (user && await user.comparePassword(password)) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            })


        } else {
            res.status(400).json({
                auth: false
            });
            throw new Error("information not exact");
        }

    } catch (error) {
        if (!user) {
            console.log('not find email');
        }
        else {
            console.log("password wrong")
        }
    }

})

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})
module.exports = { registerUser, authUser, allUsers }
const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    // xu ly khi 2 nguoi da chatting truoc do
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })
    if (isChat.length > 0) {
        res.send(isChat[0]);

    } else {
        //khi 2 nguoi chua chatting voi nhau
        var chatData = {
            ChatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat);

        }
        catch (error) {
            console.log("oh shit");
        }
    }


});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updateAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });

    }

    catch (error) {
        console.log('error when fetch chats');
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });

    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("more than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,

        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);


    } catch (error) {
        console.log("something was wrong");
    }

});

const renameGroup = asyncHandler(async (req, res) => {
    const { groupId, chatName } = req.body;
    try {
        // const chatGroup = await Chat.findOne({ _id: groupId });
        // if (chatGroup.groupAdmin._id !== req.user._id) {
        //     console.log(chatGroup.groupAdmin._id + "-" + req.user._id)
        //     console.log(chatGroup.groupAdmin._id !== req.user._id);
        //     return res.status(400).send({
        //         "message": "you are not admin"
        //     })
        // }
        const updatedChat = await Chat.findByIdAndUpdate(
            groupId, {
            chatName: chatName
        },
        )
        res.status(200).send("seccessful rename");
    } catch (error) {
        console.log(error);
    }



});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true
        }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    try {
        if (!added) {
            res.status(404).send("chat not found");
            throw new Error("chat not found")
        }
        else {
            res.json(added);
        }
    } catch (error) {
        console.log(error);
    }

});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndDelete(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true
        }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    try {
        if (!removed) {
            res.status(404).send("chat not found");
            throw new Error("chat not found")
        }
        else {
            res.json(removed);
        }
    } catch (error) {
        console.log(error);
    }

})


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }
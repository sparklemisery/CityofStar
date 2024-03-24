import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import React, { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import ScrollableFeed from "react-scrollable-feed";
const MyChats = () => {
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const fetchChats = async () => {

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            console.log("error")
        }
    }
    useEffect(() => {
        fetchChats();
    }, [])

    return (
        <div className="relative w-3/12 h-ss rounded-lg  backdrop-blur-md bg-white/30 ">

            <h3
                class=" px-6 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-2xl text-white font-bold">
                Have a good day
            </h3>
            {chats ?
                <div className="flex-col h-s1 rounded-lg border-white border-t mt-2 mb-8 overflow-hidden">
                    <ScrollableFeed className="flex-col h-full">
                        {chats.map((chat) => (
                            <div className="flex my-2">
                                <button onClick={() => { setSelectedChat(chat) }} className={`flex mx-2 justify-between ${selectedChat === chat ? 'bg-teal-200 text-white' : 'bg-white'}  w-full rounded-lg`}>
                                    <img src={getSender(user, chat.users).pic} className="m-2 w-10 h-10 rounded-full " />
                                    <div className="mr-2">
                                        <div className="flex justify-end">
                                            <h2 className="font-madimi-one float-r">{getSender(user, chat.users).name}</h2>
                                        </div>
                                        <h3 clasName="font-mono">{chat.latestMessage ?
                                            (chat.latestMessage.content.length > 20 ?
                                                chat.latestMessage.content.substring(0, 20) + "..." :
                                                chat.latestMessage.content
                                            ) :
                                            "no message"
                                        }</h3>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </ScrollableFeed>
                </div>
                : <ChatLoading />
            }


        </div>
    )
}
export default MyChats
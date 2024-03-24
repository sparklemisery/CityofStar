import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { ChatState } from "../../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:6969";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetch }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const { user, selectedChat, setSelectedChat } = ChatState();



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])


    useEffect(() => {
        if (socket) {
            console.log("socket");
        }
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare) {

            } else {

                setMessages([...messages, newMessageRecieved]);
            }
        });
    });



    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`,
                config);
            setMessages(data);
            setLoading(false);


            socket.emit("join chat", selectedChat._id);

        }
        catch (error) {
            toast('🦄 false to load messages', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });

        }
    }

    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            try {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setNewMessage("");
                setMessages([...messages, data]);
            } catch (error) {
                toast('🦄 false to send message', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",

                });
            }
        }
    }




    return (
        <>
            <ToastContainer />
            {selectedChat ? (
                <div className="relative w-9/12 ml-4 h-ss border-2 rounded-lg  backdrop-blur-md bg-white/30">
                    {loading ? <ChatLoading /> : <ScrollableChat messages={messages} />}


                    <form className="flex">
                        <div class="absolute inset-x-0 bottom-2 z-0 w-full mx-4  group">
                            <input type="text" value={newMessage} onChange={(e) => {
                                setNewMessage(e.target.value);
                            }} name="floating_email" id="floating_email" class="block py-2.5 z-0 px-0 w-11/12 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="floating_email" class=" ml-2 peer-focus:font-medium absolute rounded-md bg-white z-10 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">send my love</label>
                        </div>
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                sendMessage({ key: "Enter" });
                            }
                        } className="absolute bottom-3 right-2 hover:bg-slate-300 rounded-lg mr-3 px-1 py-1">
                            <img src="https://www.svgrepo.com/show/30442/send.svg" className="w-6 h-6 " />
                        </button>
                    </form>
                </div>
            ) : null}
        </>
    )

}
export default SingleChat
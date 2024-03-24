import React, { useEffect, useState } from "react";
import SignInPage from "./SignInPage";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

const HomePage = () => {

    const { setUser } = ChatState();

    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            setUser(user);

            navigate("/chats");
        }
    }, [])
    return (
        <div className="">
            <SignInPage />
        </div>
    )
}
export default HomePage
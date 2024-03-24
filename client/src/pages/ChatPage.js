import React from "react";
import SideDrawer from "../components/miscellanneo/SideDrawer";
import MyChats from "../components/miscellanneo/MyChats";
import SingleChat from "../components/miscellanneo/SingleChat";
const ChatPage = () => {

    return (
        <div >
            <div className="absolute inset-0">
                <img className="absolute inset-0 w-full h-full object-cover " src="https://i.pinimg.com/564x/b0/cf/51/b0cf517597fd9ae3948d3181b1db2736.jpg" />
            </div>
            <div className="relative">
                <SideDrawer />
                <div className="flex mx-32 mt-8">
                    <MyChats />
                    <SingleChat />

                </div>
            </div>
        </div>
    )
}
export default ChatPage
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed className="flex flex-col">
            {
                messages &&
                messages.map((m, i) => (
                    <div key={m._id} className={`${i === messages.length - 1 ? 'mb-16 mt-4 ' : 'my-4'}  `}>
                        <div className={`${m.sender._id === user._id ? 'float-right bg-sky-200' : 'bg-teal-200 inline-block ml-2'} rounded-lg p-2 mr-2`}>
                            {m.sender._id !== user._id ?
                                <div className="flex items-center"> {/* Container để đảm bảo thẻ h3 và thẻ img nằm cùng một hàng */}
                                    <img src={m.sender.pic} className="h-8 w-8 rounded-full mr-2"></img> {/* Thẻ img */}
                                    <h3>{m.content}</h3> {/* Thẻ h3 */}
                                </div>
                                :
                                <h3>{m.content}</h3>
                            }
                        </div>
                    </div>
                ))
            }
        </ScrollableFeed>
    )
}
export default ScrollableChat;
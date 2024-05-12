import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket/socket"
import waving from "../../../src/assets/waving.png"

const GlobalChat = ({ userName }) => {
    const [globalMsg, setGlobalMsg] = useState("");
    const [globalMsgArray, setGlobalMsgArray] = useState([]);
    const endOfMessagesRef = useRef(null); // 用於自動滑動

    // 傳送 globalMsg to others (with Id)
    const sendGlobalMsg = () => {
        socket.emit("globalMsg-from-client", globalMsg, userName, socket.id); // <--我當前使用的 id
        setGlobalMsgArray(prevMsg => [...prevMsg, { msg: globalMsg, userName, userId: socket.id }]);
        setGlobalMsg("");
    }
    // 取得 globalMsg from server (with Id)
    useEffect(() => {
        socket.on("globalMsg-from-server", (newMsg, newUserName, newUserId) => {
            setGlobalMsgArray(prevMsg => [...prevMsg, { msg: newMsg, userName: newUserName, userId: newUserId }]);
        });
        return () => {
            socket.off("globalMsg-from-server");
        };
    }, [])

    // 自動滑動到最新的訊息處
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [globalMsgArray]);

    return (
        <>
            <section className="fixed w-full h-full flex flex-col">
                {/* 訊息框 */}
                <div className="p-3 pt-2 overflow-y-scroll h-[70svh] md:h-[78svh] w-full">
                    {globalMsgArray.map((msgObj, i) => (
                        <div className={`chat ${msgObj.userId === socket.id ? "chat-end" : "chat-start"}`} key={i}>
                            <div className="chat-header">
                                {msgObj.userName}
                            </div>
                            <div className={`chat-bubble max-w-[70vw] ${msgObj.userId === socket.id ? "chat-bubble-secondary text-black" : ""}`}>
                                {msgObj.msg}
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} /> {/* 自動滑動到此 */}
                </div>

                <div className="w-24 min-h-[220px]" /> {/* behind 訊息輸入框 */}

                {/* 訊息輸入框 */}
                <div className="flex justify-center items-center gap-3 fixed bottom-0 w-full bg-base-100 rounded-t-xl custom-shadow">
                    <button className="ml-1 w-11 h-11"
                        onClick={() => setGlobalMsg(prev => prev + "👋🏻")}
                    >
                        <img src={waving} alt="waving" />
                    </button>
                    <input
                        className="p-3 my-3 rounded-md"
                        type="text"
                        placeholder="Type your message..."
                        value={globalMsg}
                        onChange={(e) => setGlobalMsg(e.target.value)}
                    />
                    <button
                        className="btn btn-primary text-white px-4 my-3 rounded-md w-20"
                        onClick={sendGlobalMsg}
                    >
                        Send
                    </button>
                </div>


            </section>
        </>
    )
}
export default GlobalChat
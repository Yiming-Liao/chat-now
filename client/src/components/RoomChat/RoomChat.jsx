import { useState, useEffect, useRef } from "react";
import { socket } from "../../socket/socket";
import waving from "../../../src/assets/waving.png"

const RoomChat = ({ userName }) => {
    const [roomId, setRoomId] = useState("");
    const [isJoined, setIsJoined] = useState(false);

    const [roomMsg, setRoomMsg] = useState("");
    const [roomMsgArray, setRoomMsgArray] = useState([]);
    const endOfMessagesRef = useRef(null); // 用於自動滑動

    // JOIN Room
    const handleJoinRoom = () => {
        if (roomId.trim() === "") return setRoomId("");
        socket.emit("join-room", roomId);
        setIsJoined(true);
    }
    // LEAVE Room
    const handleLeaveRoom = () => {
        const yes = confirm("😣 Are you sure to leave?\n⚠️ You will lose all the messages.");
        if (!yes) return;
        socket.emit("leave-room", roomId);
        setRoomMsgArray([]);
        setIsJoined(false);
    }
    // 傳送 roomMsg to others (with Id)
    const sendRoomMsg = () => {
        socket.emit("roomMsg-from-client", roomMsg, roomId, userName, socket.id);
        setRoomMsgArray(prevMsg => [...prevMsg, { msg: roomMsg, userName, userId: socket.id }]);
        setRoomMsg("");
    }
    // 取得 roomMsg from server (with Id)
    useEffect(() => {
        socket.on("roomMsg-from-server", (newMsg, newUserName, newUserId) => {
            setRoomMsgArray(prevMsg => [...prevMsg, { msg: newMsg, userName: newUserName, userId: newUserId }]);
        });
        return () => {
            socket.off("roomMsg-from-server");
        };
    }, []);

    // 自動滑動到最新的訊息處
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [roomMsgArray]);

    return (
        <section className="fixed w-full h-full flex flex-col">

            {/* 加入房間框 */}
            <div className="flex justify-center gap-5  bottom-0 w-full bg-base-100 rounded-b-xl custom-shadow">
                <div className="text-lg text-slate-500 self-center font-semibold">Room :</div>
                <input
                    className="p-2 my-3 rounded-md w-40"
                    type="text"
                    placeholder="Room ID..."
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isJoined ? true : false}
                />
                {/* Join / Leave Button */}
                {!isJoined ? (
                    <button
                        className="bg-secondary text-white px-4 my-3 rounded-md w-20"
                        onClick={handleJoinRoom}
                    >
                        Join
                    </button>
                ) : (
                    <button
                        className="bg-error text-white px-4 my-3 rounded-md w-20"
                        onClick={handleLeaveRoom}
                    >
                        Leave
                    </button>
                )}

            </div>


            {/* 訊息框 */}
            <div className="p-3 pt-2 overflow-y-scroll h-[70svh] md:h-[78svh] w-full">
                {roomMsgArray.map((msgObj, i) => (
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
                    onClick={() => setRoomMsg(prev => prev + "👋🏻")}
                    disabled={isJoined ? false : true}
                >
                    <img src={waving} alt="waving" />
                </button>
                <input
                    className="p-2 my-3 rounded-md"
                    type="text"
                    placeholder="Type your message..."
                    value={roomMsg}
                    onChange={(e) => setRoomMsg(e.target.value)}
                    disabled={isJoined ? false : true}
                />
                <button
                    className="btn btn-primary text-white px-4 my-3 rounded-md w-20"
                    onClick={sendRoomMsg}
                    disabled={isJoined ? false : "disabled"}
                >
                    Send
                </button>
            </div>


        </section>

    )
}
export default RoomChat



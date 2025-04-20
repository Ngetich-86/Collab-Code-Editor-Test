import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { FaUser, FaKey, FaSignInAlt, FaPlus } from "react-icons/fa";

export default function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    const generateRoomId = () => {
        const newRoomId = uuidv4();
        setRoomId(newRoomId);

        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(newRoomId)
                .then(() => toast.success("Room ID copied to clipboard!"))
                .catch(() => toast.error("Copy manually: " + newRoomId));
        } else {
            // Fallback for unsupported browsers
            const textArea = document.createElement("textarea");
            textArea.value = newRoomId;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                toast.success("Room ID copied to clipboard!");
            } catch {
                toast.error("Copy manually: " + newRoomId);
            }
            document.body.removeChild(textArea);
        }
    };

    const joinRoom = () => {
        if (roomId && username) {
            router.push(`/editor/${roomId}?username=${username}`);
        } else {
            toast.error("Please enter both username and room ID");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Collaborative Code Editor</h1>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <input
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaKey className="text-gray-400" />
                        </div>
                        <input
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button 
                            onClick={joinRoom}
                            className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaSignInAlt />
                            <span>Join Room</span>
                        </button>
                        <button 
                            onClick={generateRoomId}
                            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaPlus />
                            <span>Create Room</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


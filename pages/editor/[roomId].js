// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import Editor from "@monaco-editor/react";

// const socket = io("http://localhost:3001");

// export default function EditorPage() {
//     const router = useRouter();
//     const { roomId, username } = router.query;
//     const [code, setCode] = useState("");
//     const [users, setUsers] = useState([]);
//     const [language, setLanguage] = useState("javascript");

//     useEffect(() => {
//         if (!roomId || !username) return;
//         socket.emit("join-room", { roomId, username });

//         socket.on("update-code", (newCode) => setCode(newCode));
//         socket.on("room-users", (roomUsers) => setUsers(roomUsers));

//         return () => socket.disconnect();
//     }, [roomId, username]);

//     return (
//         <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
//             <h2 className="text-lg font-bold">Room ID: {roomId}</h2>
//             <h3 className="text-md mb-2">Users: {users.join(", ")}</h3>
//             <select className="mb-2 p-2 bg-gray-700 text-white rounded" value={language} onChange={(e) => setLanguage(e.target.value)}>
//                 <option value="javascript">JavaScript</option>
//                 <option value="python">Python</option>
//                 <option value="cpp">C++</option>
//                 <option value="java">Java</option>
//             </select>
//             <Editor
//                 height="80vh"
//                 theme="vs-dark"
//                 language={language}
//                 value={code}
//                 onChange={(newCode) => {
//                     setCode(newCode);
//                     socket.emit("code-changed", { roomId, code: newCode });
//                 }}
//             />
//         </div>
//     );
// }


// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

// collab_editor/pages/editor/[roomId].js

import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCopy, FaUsers, FaCog, FaInfoCircle, FaSun, FaMoon, FaJava, FaHome, FaCode, FaBars, FaTimes } from "react-icons/fa";
import { SiJavascript, SiPython, SiCplusplus } from "react-icons/si";

const socket = io("http://localhost:3001");

export default function EditorPage() {
    const router = useRouter();
    const { roomId, username } = router.query;
    const [code, setCode] = useState("");
    const [users, setUsers] = useState([]);
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [activeSection, setActiveSection] = useState("roomInfo");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleCodeChange = useCallback((newCode) => {
        setCode(newCode);
        socket.emit("code-changed", { roomId, code: newCode });
        toast.success("Changes saved", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, [roomId]);

    useEffect(() => {
        if (!roomId || !username) return;

        const handleJoinRoom = () => {
            socket.emit("join-room", { roomId, username });
        };

        const handleUpdateCode = (newCode) => {
            setCode(newCode);
            toast.info("Code updated by another user", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        };

        const handleRoomUsers = (roomUsers) => {
            setUsers(roomUsers);
            toast.info(`Users in room: ${roomUsers.length}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        };

        handleJoinRoom();
        socket.on("update-code", handleUpdateCode);
        socket.on("room-users", handleRoomUsers);

        return () => {
            socket.off("update-code", handleUpdateCode);
            socket.off("room-users", handleRoomUsers);
            socket.disconnect();
        };
    }, [roomId, username]); // Remove socket from deps as it's stable

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied to clipboard!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const handleThemeChange = () => {
        const newTheme = theme === "vs-dark" ? "light" : "vs-dark";
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme === "vs-dark" ? "Dark" : "Light"} mode`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const getLanguageIcon = (lang) => {
        switch (lang) {
            case "javascript":
                return <SiJavascript className="text-yellow-400" />;
            case "python":
                return <SiPython className="text-blue-500" />;
            case "cpp":
                return <SiCplusplus className="text-blue-600" />;
            case "java":
                return <FaJava className="text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {/* Top Navigation Bar */}
            <nav className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                {isSidebarOpen ? <FaTimes /> : <FaBars />}
                            </button>
                            <FaCode className="text-blue-500 text-2xl" />
                            <span className="text-xl font-bold text-white">CodeCollab</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {getLanguageIcon(language)}
                                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-300">Users: {users.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className={`${isSidebarOpen ? 'w-1/5' : 'w-0'} md:w-1/5 transition-all duration-300 ease-in-out bg-gray-800 shadow-2xl flex flex-col overflow-hidden`}>
                    <div className="p-6 flex flex-col h-full">
                        <nav className="space-y-2">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full p-3 rounded-lg text-left flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-200"
                            >
                                <FaHome className="text-blue-400" />
                                <span>Back to Home</span>
                            </button>
                            <button
                                className={`w-full p-3 rounded-lg text-left flex items-center space-x-2 ${
                                    activeSection === "roomInfo" ? "bg-gray-700" : "hover:bg-gray-700"
                                }`}
                                onClick={() => setActiveSection("roomInfo")}
                            >
                                <FaInfoCircle className="text-blue-400" />
                                <span>Room Info</span>
                            </button>
                            <button
                                className={`w-full p-3 rounded-lg text-left flex items-center space-x-2 ${
                                    activeSection === "participants" ? "bg-gray-700" : "hover:bg-gray-700"
                                }`}
                                onClick={() => setActiveSection("participants")}
                            >
                                <FaUsers className="text-green-400" />
                                <span>Participants</span>
                            </button>
                            <button
                                className={`w-full p-3 rounded-lg text-left flex items-center space-x-2 ${
                                    activeSection === "settings" ? "bg-gray-700" : "hover:bg-gray-700"
                                }`}
                                onClick={() => setActiveSection("settings")}
                            >
                                <FaCog className="text-purple-400" />
                                <span>Settings</span>
                            </button>
                        </nav>

                        <div className="mt-4 flex-1 overflow-y-auto">
                            {activeSection === "roomInfo" && (
                                <div className="space-y-4">
                                    <div className="relative transform-style-3d perspective-1000">
                                        <h2 className="text-lg font-bold">Username</h2>
                                        <span className="text-sm text-gray-300 bg-gray-600 px-2 py-1 rounded-lg shadow-md transform-3d rotate-x-10 hover:rotate-x-0 transition-transform duration-300">
                                            {username}
                                        </span>
                                    </div>
                                    <div className="relative transform-style-3d perspective-1000">
                                        <h2 className="text-lg font-bold">Room ID</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-300 bg-gray-600 px-2 py-1 rounded-lg shadow-md transform-3d rotate-y-10 hover:rotate-y-0 transition-transform duration-300">
                                                {roomId}
                                            </span>
                                            <button onClick={copyRoomId} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition">
                                                <FaCopy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === "participants" && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold mb-3">Participants</h3>
                                    {users.map((user, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-center font-semibold shadow-lg transform hover:scale-105 transition">
                                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-md text-white">{user}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSection === "settings" && (
                                <div className="mt-6">
                                    <label className="block text-sm mb-2">Language:</label>
                                    <select
                                        className="w-full p-2 rounded bg-gray-700 text-white shadow-md"
                                        value={language}
                                        onChange={(e) => {
                                            setLanguage(e.target.value);
                                            toast.success(`Language changed to ${e.target.value}`, {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            });
                                        }}
                                    >
                                        <option value="javascript" className="flex items-center">
                                            <SiJavascript className="mr-2" /> JavaScript
                                        </option>
                                        <option value="python">
                                            <SiPython className="mr-2" /> Python
                                        </option>
                                        <option value="cpp">
                                            <SiCplusplus className="mr-2" /> C++
                                        </option>
                                        <option value="java">
                                            <FaJava className="mr-2" /> Java
                                        </option>
                                    </select>
                                    <button
                                        className="w-full mt-4 p-2 bg-blue-500 rounded-lg hover:bg-blue-600 shadow-lg transform hover:scale-105 transition flex items-center justify-center space-x-2"
                                        onClick={handleThemeChange}
                                    >
                                        {theme === "vs-dark" ? (
                                            <>
                                                <FaSun className="text-yellow-400" />
                                                <span>Switch to Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaMoon className="text-gray-200" />
                                                <span>Switch to Dark Mode</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Section (Right Side) */}
                <div className={`${isSidebarOpen ? 'w-4/5' : 'w-full'} md:w-4/5 p-6 transition-all duration-300 ease-in-out`}>
                    <Editor
                        height="100%"
                        width="100%"
                        language={language}
                        theme={theme}
                        value={code}
                        onChange={handleCodeChange}
                    />
                </div>
            </div>
        </div>
    );
}


import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export default function EditorPage({ roomId, username }) {
  const editorRef = useRef(null);
  const [code, setCode] = useState("// Start coding...");
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = io('http://localhost:3000');

  useEffect(() => {
    if (!roomId || !username) return;

    setIsLoading(true);
    socket.emit("join-room", { roomId, username });

    socket.on("load-code", (existingCode) => {
      setCode(existingCode);
      setIsLoading(false);
      toast.success("Successfully connected to the room!");
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
      toast.info("Code updated by another user");
    });

    socket.on("user-list", (users) => {
      setCollaborators(users);
      toast.info(`Users in room: ${users.length}`);
    });

    socket.on("connect_error", () => {  // Remove unused 'error' parameter
      toast.error("Failed to connect to the server");
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username, socket]); // Add socket to dependencies

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(document.getElementById("editor"), {
        value: code,
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: {
          enabled: true,
        },
        fontSize: 14,
        fontFamily: "JetBrains Mono, monospace",
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: "line",
        automaticLayout: true,
      });

      editorRef.current.onDidChangeModelContent(() => {
        const newCode = editorRef.current.getValue();
        setCode(newCode);
        socket.emit("code-change", { roomId, code: newCode });
        toast.success("Changes saved");
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [socket, roomId]); // Add socket and roomId as dependencies

  useEffect(() => {
    if (socket) {
      socket.emit('sync-code', {
        code,
        roomId
      });
    }
  }, [code, roomId, socket]); // Add socket to dependencies

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#0ea5e9" size={50} />
          <p className="mt-4 text-gray-600">Connecting to the room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Responsive Sidebar */}
      <div className="w-64 md:w-72 lg:w-80 bg-white border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Collaborative Editor</h1>
          <p className="text-xs md:text-sm text-gray-500">Room: {roomId}</p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm md:text-base font-medium">
            {username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm md:text-base font-medium text-gray-700">{username}</span>
        </div>

        <div className="flex-1">
          <h2 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">
            Collaborators
          </h2>
          <div className="space-y-1.5 md:space-y-2">
            {collaborators.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm md:text-base font-medium">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs md:text-sm text-gray-700">{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">File:</span>
            <span className="text-sm font-medium text-gray-700">index.js</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div id="editor" className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { toast } from "sonner";

export default function RoomList({ users }) {
    useEffect(() => {
        if (users.length > 0) {
            toast.info(`Total users in room: ${users.length}`);
        }
    }, [users]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Connected Users
            </h3>
            <ul className="space-y-2">
                {users.map((user, index) => (
                    <li 
                        key={index} 
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                            {user?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{user}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

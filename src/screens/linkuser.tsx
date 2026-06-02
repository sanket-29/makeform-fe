"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/src/config/api";

type User = {
    _id: string;
    name: string;
    username: string;
    email: string;
    address: string;
};

export default function LinkUser({ applicationId }: { applicationId: string }) {
    const [users, setUsers] = useState<User[]>([]);
    const [linkedUserId, setLinkedUserId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // 🔥 FETCH USERS
    const fetchUsers = async () => {
        const res = await fetch(`${BASE_URL}/api/user`);
        const data = await res.json();
        setUsers(data);
    };

    // 🔥 FETCH LINKED USER
    const fetchLinkedUser = async () => {
        const res = await fetch(
            `${BASE_URL}/api/link-user/${applicationId}`
        );
        const data = await res.json();
        setLinkedUserId(data.userId);
    };

    useEffect(() => {
        fetchUsers();
        fetchLinkedUser();
    }, [applicationId]);

    // ✅ CONNECT USER
    const handleConnect = async (userId: string) => {
        const confirm = window.confirm(
            "Are you sure you want to link the application to the selected user?"
        );

        if (!confirm) return;

        await fetch(`${BASE_URL}/api/link-user/link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ applicationId, userId }),
        });

        setLinkedUserId(userId);
    };

    // 🔍 FILTER USERS
    const filteredUsers = users.filter((user) =>
        `${user.name} ${user.username} ${user.email} ${user.address}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const connectedUser = users.find((u) => u._id === linkedUserId);

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 text-white">

            {/* 🔥 TOP BAR */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    <span className="text-red-400 font-semibold">
                        Connected to:
                    </span>{" "}
                    {connectedUser
                        ? `${connectedUser.name} (${connectedUser.email})`
                        : ""}
                </div>

                {/* 🔍 SEARCH */}
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm outline-none"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-sm border border-white/10">
                    <thead className="bg-white/10 text-gray-300">
                        <tr>
                            <th className="p-2 border border-white/10 text-left">Name</th>
                            <th className="p-2 border border-white/10 text-left">User Name</th>
                            <th className="p-2 border border-white/10 text-left">Email</th>
                            <th className="p-2 border border-white/10 text-left">Address</th>
                            {/* <th className="p-2 border border-white/10 text-center">Connect</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center p-4 text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => {
                                const isConnected = linkedUserId === user._id;

                                return (
                                   <tr
  key={user._id}
  className={`transition ${
   isConnected
  ? "bg-blue-500/10 border border-blue-400/20 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
      : "hover:bg-white/5"
  }`}
>
                                        <td className="p-2 border border-white/10">
                                            <span
                                                onClick={() => {
                                                    if (!isConnected) handleConnect(user._id);
                                                }}
                                                className={`text-blue-400 ${isConnected
                                                        ? "cursor-default"
                                                        : "hover:underline cursor-pointer"
                                                    }`}
                                            >
                                                {user.name}
                                            </span>
                                        </td>
                                        <td className="p-2 border border-white/10">
                                            {user.username}
                                        </td>
                                        <td className="p-2 border border-white/10">
                                            {user.email}
                                        </td>
                                        <td className="p-2 border border-white/10">
                                            {user.address}
                                        </td>

                                        {/* <td className="p-2 border border-white/10 text-center">
                      {isConnected ? (
                        <span className="text-red-400 font-semibold">
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConnect(user._id)}
                          className="text-blue-400 hover:underline"
                        >
                          Connect
                        </button>
                      )}
                    </td> */}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/users";

import { io, Socket } from "socket.io-client";
import { PiSignOutBold } from "react-icons/pi";
import { CreateCommunityDialog } from "@/components/createCommunityDialog";
import { getComunidades } from "@/communities";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Chat } from "@/components/chat";
import { Button } from "@/components/ui/button";

import { AddUser } from "@/components/addUser";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate({ from: "/dashboard" });
  const auth = useAuth();
  const [,setchatId] = useState("");
  const [enterRoomFlag, setenterRoomFlag] = useState(false);
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleLogout = () => {
    auth.setUser(null);
    navigate({ to: "/" });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["comunidades"],
    queryFn:  () =>  getComunidades(auth.user!),
  });

  useEffect(() => {
    const newSocket = io("ws://localhost:3500");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    //create chat room for each community you participate
    data?.map((comunidade) => {
      const room = comunidade.nome;
      if (name && comunidade.nome && socket) {
        socket.emit("enterRoom", {
          name,
          room,
        });
      }
    });

    // socket.on("userList", ({ users }: { users: User[] }) => {
    //   setUsers(users);
    // });

    // socket.on("roomList", ({ rooms }: { rooms: Room[] }) => {
    //   setRooms(rooms);
    // });

    return () => {
      socket.off("message");
      socket.off("activity");
      socket.off("userList");
      socket.off("roomList");
    };
  }, [data, name, socket]);

  const enterRoom = (e: React.MouseEvent, room: string) => {
    e.preventDefault();
    const name = auth.user!;
    
    setRoom(room);
    setName(name);
    setenterRoomFlag(true);
  };

  

  return (
    <div className="h-[99vh] fixed">
      <nav className="topbar w-screen bg-slate-600 h-14 flex justify-between items-center p-4">
        <h1 className="scroll-m-20 text-4xl  tracking-tight lg:text-3xl">
          COMMUNITY CHAT
        </h1>

        <div className="flex gap-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {auth.user}
          </h3>
          <CreateCommunityDialog />
          <Button variant="outline" size="icon" onClick={() => handleLogout()}>
            <PiSignOutBold />
          </Button>
        </div>
      </nav>
      <section className="h-[94%] flex">
        <section className="h-[100vh] w-[250px]  bg-slate-500">
          {!isLoading &&
            data?.map((comunidade) => (
              <div
                className="pl-3 flex items-center justify-between p-2"
                key={comunidade.id}
              >
                <Button
                  variant="ghost"
                  onClick={(e: React.MouseEvent) => {
                    setchatId(comunidade.id);
                    enterRoom(e, comunidade.nome);
                  }}
                >
                  {comunidade.nome}
                </Button>

                {comunidade.criador == auth.user && (
                  <AddUser comunidade={comunidade.nome} />
                )}
              </div>
            ))}
        </section>

        {enterRoomFlag && <Chat room={room} name={name} socket={socket} />}
      </section>
    </div>
  );
}

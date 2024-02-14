import "./chat.css";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";

interface Message {
  name: string;
  text: string;
  time: string;
}

interface User {
  name: string;
}

interface Room {
  name: string;
}

const FormSchema = z.object({
  mensagem: z.string().min(1, { message: "Mensagem não pode ser vazia" }),
});

interface ChatProps {
  room: string;
  name: string;
  socket: Socket | null;
}
export function Chat({ room, name, socket }: ChatProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [activity, setActivity] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {
  //   const newSocket = io("ws://localhost:3500");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (data: Message) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);

      setActivity("");
    });

    socket.on("activity", (name: string) => {
      setActivity(`${name} is typing...`);
      setTimeout(() => {
        setActivity("");
      }, 3000);
    });

    socket.on("userList", ({ users }: { users: User[] }) => {
      setUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("activity");
      socket.off("userList");
      socket.off("roomList");
    };
  }, [socket]);

  useEffect(() => {
    if (name && room && socket) {
      socket.emit("enterRoom", {
        name,
        room,
      });
      setChatMessages([]);
    }
  }, [name, room, socket]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (name && data.mensagem && room && socket) {
      socket.emit("message", {
        name,
        text: data.mensagem,
      });
      form.setValue("mensagem", "");
    }
  }

  return (
    <section className=" h-[100%] w-[100%]  flex flex-col bg-slate-400 p-1 pb-4 ">
      <section className=" bg-slate-800">
        <h2 className="scroll-m-20  p-2 pb-0 text-3xl font-semibold tracking-tight first:mt-0 text-white">
          {room}
        </h2>
        <p className=" text-white pl-2">
          <em>Usuários online: </em>
          {users.map(
            (user, index) =>
              `${user.name}${index !== users.length - 1 ? "," : ""}`
          )}
        </p>
      </section>

      <ul className="list-none w-full max-w-600px rounded-lg m-auto  flex flex-col justify-start overflow-auto flex-grow">
        {chatMessages.map((msg, index) => (
          <li
            key={index}
            className={`post ${msg.name === name ? "post--right" : msg.name !== "Admin" ? "post--left" : ""}`}
          >
            <div
              className={`post__header ${msg.name === name ? "bg-slate-500" : "bg-slate-700"}`}
            >
              <span className="post__header--name">{msg.name}</span>
              <span className="post__header--time">{msg.time}</span>
            </div>
            <div className="post__text">{msg.text}</div>
          </li>
        ))}
      </ul>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full  items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="mensagem"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Escreva sua mensagem aqui" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Enviar</Button>
        </form>
      </Form>
    </section>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
// import './teste.css'
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



const ChatApp: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [activity, setActivity] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    useEffect(() => {
        const newSocket = io('ws://localhost:3500');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (data: Message) => {
            setChatMessages(prevMessages => [...prevMessages, data]);
            setActivity('');
        });

        socket.on('activity', (name: string) => {
            setActivity(`${name} is typing...`);
            setTimeout(() => {
                setActivity('');
            }, 3000);
        });

        socket.on('userList', ({ users }: { users: User[] }) => {
            setUsers(users);
        });

        socket.on('roomList', ({ rooms }: { rooms: Room[] }) => {
            setRooms(rooms);
        });

        return () => {
            socket.off('message');
            socket.off('activity');
            socket.off('userList');
            socket.off('roomList');
        };
    }, [socket]);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name && message && room && socket) {
            socket.emit('message', {
                name,
                text: message
            });
            setMessage('');
        }
    };

    const enterRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name && room && socket) {
            socket.emit('enterRoom', {
                name,
                room
            });
        }
    };

    return (
        <main>
            <form className="form-join" onSubmit={enterRoom}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Chat room" required />
                <button type="submit">Join</button>
            </form>

            <ul className="chat-display">
                {chatMessages.map((msg, index) => (
                    <li key={index} className={`post ${msg.name === name ? 'post--left' : (msg.name !== 'Admin' ? 'post--right' : '')}`}>
                        <div className={`post__header ${msg.name === name ? 'post__header--user' : 'post__header--reply'}`}>
                            <span className="post__header--name">{msg.name}</span>
                            <span className="post__header--time">{msg.time}</span>
                        </div>
                        <div className="post__text">{msg.text}</div>
                    </li>
                ))}
            </ul>

            <p className="user-list">
                <em>Users in {room}:</em> {users.map((user, index) => `${user.name}${index !== users.length - 1 ? ',' : ''}`)}
            </p>

            <p className="room-list">
                <em>Active Rooms:</em> {rooms.map((room, index) => `${room.name}${index !== rooms.length - 1 ? ',' : ''}`)}
            </p>

            <p className="activity">{activity}</p>

            <form className="form-msg" onSubmit={sendMessage}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" required />
                <button type="submit">Send</button>
            </form>
        </main>
    );
};

export default ChatApp;

export const Route = createFileRoute("/teste")({
  component: ChatApp,
});
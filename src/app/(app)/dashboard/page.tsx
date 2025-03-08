"use client"

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import { User } from "next-auth";

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: true
        }
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch("acceptMessages");

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const res = await axios.get("/api/accept-message");
            setValue("acceptMessages", res.data.isAcceptingMessage);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        try {
            const res = await axios.get("/api/get-messages");
            setMessages(res.data.message);
            if (refresh) {
                toast.success("Refreshed Messages", {
                    description: "Showing latest messages"
                });
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchAcceptMessage();
        fetchMessages();
    }, [session, fetchAcceptMessage, fetchMessages]);

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const newValue = !acceptMessages;
            const res = await axios.post("/api/accept-message", {
                acceptMessages: newValue
            });
            setValue("acceptMessages", newValue);
            toast.success("Success", {
                description: res.data.message
            });
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg.id !== messageId));
    };

    if (!session || !session.user) {
        return <div>Please login!</div>;
    }

    const { username } = session.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Success", {
            description: "URL copied successfully"
        });
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            {/* Copy Link */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            {/* Accept Messages Switch */}
            <div className="mb-4 flex items-center">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>

            <Separator />

            {/* Refresh Button */}
            <Button
                className="mt-4"
                variant="outline"
                onClick={() => fetchMessages(true)}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            {/* Messages */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}

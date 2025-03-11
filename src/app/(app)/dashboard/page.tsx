"use client"

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Message } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Loader2, RefreshCcw, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import MessageCard from "@/components/MessageCard"
import { User } from "next-auth"
import { motion } from "framer-motion"

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: true
        }
    })

    const { register, watch, setValue } = form
    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.get("/api/accept-message")
            setValue("acceptMessages", res.data.isAcceptingMessage)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true)
        try {
            const res = await axios.get("/api/get-messages")
            setMessages(res.data.message)
            if (refresh) {
                toast.success("Refreshed Messages", {
                    description: "Showing latest messages"
                })
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message
            })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session || !session.user) return
        fetchAcceptMessage()
        fetchMessages()
    }, [session, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true)
        try {
            const newValue = !acceptMessages
            const res = await axios.post("/api/accept-message", {
                acceptMessages: newValue
            })
            setValue("acceptMessages", newValue)
            toast.success("Success", {
                description: res.data.message
            })
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg.id !== messageId))
    }

    if (!session || !session.user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4 animate-in fade-in-0 slide-in-from-bottom-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Please login to continue</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to access the dashboard</p>
                </div>
            </div>
        )
    }

    const { username } = session.user as User
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("Success", {
            description: "URL copied successfully"
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        User Dashboard
                    </h1>

                    {/* Copy Link Section */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Profile Link</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 font-mono text-sm">
                                {profileUrl}
                            </div>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Copy
                            </Button>
                        </div>
                    </div>

                    {/* Accept Messages Switch */}
                    <div className="flex items-center gap-4 py-2">
                        <Switch
                            {...register("acceptMessages")}
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                            className="data-[state=checked]:bg-purple-600"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {acceptMessages ? "Currently accepting messages" : "Not accepting messages"}
                        </span>
                    </div>

                    <Separator className="my-6" />

                    {/* Messages Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Messages</h2>
                            <Button
                                variant="outline"
                                onClick={() => fetchMessages(true)}
                                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCcw className="w-4 h-4" />
                                )}
                                Refresh
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <MessageCard
                                            message={message}
                                            onMessageDelete={handleDeleteMessage}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
                                    <p>No messages to display.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
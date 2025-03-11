"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Send } from "lucide-react"
import { motion } from "framer-motion"

export default function Message() {
    const params = useParams<{username: string}>()
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const isSubmitting = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const { content } = data
            const response = await axios.post("/api/send-message", {
                username: params.username,
                content
            })
            toast.success("Success", {
                description: response.data.message
            })
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error("Error", {
                description: errorMessage || "Something went wrong"
            })
        } finally {
            form.reset()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
                >
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                Send Anonymous Message
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                to <span className="font-semibold text-purple-600 dark:text-purple-400">@{params.username}</span>
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Type your anonymous message here..." 
                                                    className="min-h-[160px] resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600 transition-colors duration-200"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 justify-center">
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Your message will be sent anonymously.</p>
                            <p>Be kind and respectful!</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
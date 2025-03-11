"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/schemas/signupSchema"
import { useDebounceCallback } from "usehooks-ts"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus, Check, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Signup() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if(username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (err) {
                    const AxiosError = err as AxiosError<ApiResponse>
                    setUsernameMessage(
                        AxiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUniqueUsername()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/signup", data)
            toast.success("Success", {
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (err) {
            console.error("Error in signup of user")
            const axiosError = err as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error("Error in signing up", {
                description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-2 mb-8"
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join Inkognito to start your anonymous journey
                        </p>
                    </motion.div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        placeholder="Choose a username" 
                                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600 pr-10"
                                                        {...field} 
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            debounced(e.target.value)
                                                        }}
                                                    />
                                                    {isCheckingUsername && (
                                                        <div className="absolute right-3 top-2.5">
                                                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                                        </div>
                                                    )}
                                                    {!isCheckingUsername && usernameMessage && (
                                                        <div className="absolute right-3 top-2.5">
                                                            {usernameMessage === "Username is available" ? (
                                                                <Check className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            {usernameMessage && (
                                                <p className={`text-sm mt-1 ${
                                                    usernameMessage === "Username is available" 
                                                        ? "text-green-500" 
                                                        : "text-red-500"
                                                }`}>
                                                    {usernameMessage}
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter your email" 
                                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="password" 
                                                    placeholder="Create a password" 
                                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-600"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button 
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all"
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            Creating account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            Create Account
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 text-center text-gray-600 dark:text-gray-400"
                    >
                        <p>
                            Already have an account?{' '}
                            <Link 
                                href="/signin" 
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
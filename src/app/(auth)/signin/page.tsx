"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signinSchema } from "@/schemas/signinSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"

export default function Signin() {
    const router = useRouter()
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
              toast.error("Login Failed", {
                description: 'Incorrect username or password',
              });
            } else {
              toast.error("Error", {
                description: result.error
              });
            }
        }
        if(result?.url) {
            router.replace("/dashboard")
        }
    }

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
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to continue your anonymous journey
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
                                    name="identifier"
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
                                transition={{ delay: 0.4 }}
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
                                                    placeholder="Enter your password" 
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
                                transition={{ delay: 0.5 }}
                            >
                                <Button 
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all"
                                    type="submit"
                                >
                                    {form.formState.isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center text-gray-600 dark:text-gray-400"
                    >
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link 
                                href="/signup" 
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
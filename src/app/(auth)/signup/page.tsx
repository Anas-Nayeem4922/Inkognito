"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/schemas/signupSchema";
import { useDebounceCallback } from "usehooks-ts"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
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
import { Loader2 } from "lucide-react"
import Link from "next/link";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const router = useRouter();

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if(username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (err) {
                    const AxiosError = err as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        AxiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUniqueUsername();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post("/api/signup", data);
            toast.success("Success", {
                description: response.data.message
            });
            router.replace(`/verify/${username}`)
        } catch (err) {
            console.error("Error in signup of user");
            const axiosError = err as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message
            toast.error("Error in signing up", {
                description: errorMessage
            });
            setIsSubmitting(false);
        }
        
    }

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Inkognito Message</h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your username" {...field} onChange={(e) => {
                                field.onChange(e)
                                debounced(e.target.value)
                            }}/>
                        </FormControl>
                        {isCheckingUsername && <Loader2 className="animate-spin"/>}
                        <p className={`text-sm ${usernameMessage === "Username is available" ? `text-green-500` : `text-red-500`}`}>
                            {usernameMessage}
                        </p>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your email" {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className="w-full" type="submit" disabled={isSubmitting}>{
                            isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait...
                                </>
                            ) : ('Signup')
                    }</Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p> Already a member?{' '}
                    <Link href="/signin" className="text-blue-600 hover:text-blue-800">Sign in</Link>
                </p>
            </div>
        </div>
    </div>
    
}
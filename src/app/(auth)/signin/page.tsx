"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios"
import { signinSchema } from "@/schemas/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Signin() {
    const router = useRouter();
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        console.log(result);
        if(result?.error) {
            toast.error("Error", {
                description: "Incorrect username or password"
            })
        } 
        if(result?.url) {
            router.replace("/dashboard");
        }
    }
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Welcome to Inkognito Message</h1>
                <p className="mb-4">Sign in to continue your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your email" {...field} />
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
                            <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className="w-full" type="submit">{
                            form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait...
                                </>
                            ) : ('Signin')
                    }</Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p> Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-800">Sign up</Link>
                </p>
            </div>
        </div>
    </div>
}
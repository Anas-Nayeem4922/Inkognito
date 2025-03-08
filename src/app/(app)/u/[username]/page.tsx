"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function Message() {
    const params = useParams<{username: string}>();
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const { content } = data;
            const response = await axios.post("/api/send-message", {
                username: params.username,
                content
            })
            toast.success("Success", {
                description: response.data.message
            })
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.error("Error", {
                description: errorMessage || "Something went wrong"
            })
        } finally {
            form.reset();
        }
        
    }
    return <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-center mt-6">Public Profile Link</h1>
        <div className="flex h-screen w-[80%] flex-col mx-auto">
            <p className="font-bold mb-4">Send anonymous messages to @{params.username}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea className="w-full" placeholder="Enter your message" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>

        </div>
    </div>
}
"use client"

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Message } from "@prisma/client"
import { format } from "date-fns"

export default function MessageCard({ message, onMessageDelete }: {
    message: Message
    onMessageDelete: (messageId: string) => void
}) {
    const handleDelete = async () => {
        const response = await axios.delete(`/api/delete-message/${message.id}`);
        toast.success("Success", {
            description: response.data.message
        });
        onMessageDelete(message.id);
    }

    return (
        <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <Card className="group bg-white dark:bg-gray-800 overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-in fade-in-0 zoom-in-95">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The message will be permanently deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardHeader className="space-y-2 p-6">
                    <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                        {message.content}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        {format(new Date(message.createdAt), "PPP p")}
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
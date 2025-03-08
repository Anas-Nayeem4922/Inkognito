
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
import { X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Message } from "@prisma/client"
import { format } from "date-fns";
  
  

export default function MessageCard({ message, onMessageDelete } : {
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
    return <div>
        <Card className="p-4 shadow-lg rounded-2xl border border-gray-200 bg-white relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 p-2">
            <X className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-lg font-semibold text-gray-900">{message.content}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {format(new Date(message.createdAt), "PPP p")}
        </CardDescription>
      </CardHeader>
    </Card>

    </div>
}
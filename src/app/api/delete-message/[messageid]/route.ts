import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { client } from "@/lib/db";

export async function DELETE(req: Request, {params} : {
    params: Promise<{messageid: string}>
}) {
    const messageId = (await params).messageid;
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not logged-in"
        }, {status: 401})
    };
    const userId = user.id;
    try {
        const message = await client.message.delete({
            where: {
                id: messageId,
                userId
            }
        });
        if(message) {
            return Response.json({
                success: true,
                message: "Message deleted successfully!"
            })
        } else {
            return Response.json({
                success: false,
                message: "Message not found or you don't have access"
            }, {status: 400});
        }
    } catch (err) {
        console.error("Error in deleting message", err)
        return Response.json({
            success: false,
            message: "Error deleting the message"
        }, {status: 500});
    }
}
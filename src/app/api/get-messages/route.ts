import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { client } from "@/lib/db";

export async function GET(req: Request) {
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
        const messages = await client.message.findMany({
            where: {
                userId
            }, orderBy: {
                createdAt: "asc"
            }
        });
        return Response.json({
            success: true,
            message: messages.length > 0 ? messages : "No messages"
        });
    } catch (error) {
        console.error("Error in fetching the messages", error);
        return Response.json({
            success: false,
            message: "Error in fetching the messages"
        })
    }
}
import { client } from "@/lib/db";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(req: Request) {
    const data = await req.json();
    const { success, error } = messageSchema.safeParse(data);
    if(!success) {
        return Response.json({
            success: false,
            message: error.message
        }, {status: 411});
    }
    const { username, content } = data;
    try {
        const user = await client.user.findFirst({
            where: {
                username
            }
        })
        if(!user) {
            return Response.json({
                success: false,
                message: "No user found with this username"
            }, {status: 404})
        }
        if(!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {status: 400})
        }
        await client.message.create({
            data: {
                content,
                userId: user.id
            }
        });
        return Response.json({
            success: true,
            message: "Message sent successfully"
        })
    } catch (err) {
        console.error("Error in sending the messages", error);
        return Response.json({
            success: false,
            message: "Error in sending the messages"
        })
    }
}
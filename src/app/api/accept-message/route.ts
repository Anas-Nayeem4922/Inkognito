import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { client } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not logged-in"
        }, {status: 401})
    };
    const userId = user.id;
    const { acceptMessages } = await req.json();
    try {
        await client.user.update({
            where: {
                id: userId
            }, data: {
                isAcceptingMessage: acceptMessages
            }
        });
        return Response.json({
            success: true,
            message: "Changed status successfully",
        })
    } catch (err) {
        console.error("Failed to update user status of message acceptance", err);
        return Response.json({
            success: false,
            message: "Failed to update user status of message acceptance"
        }, {status: 500})
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not logged-in",
            },
            { status: 401 }
        );
    }

    const userId = user.id;

    try {
        const user = await client.user.findFirst({
            where: { id: userId },
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "No user exists",
            });
        }

        return Response.json({
            success: true,
            isAcceptingMessage: user.isAcceptingMessage,
        });
    } catch (err) {
        console.error("Failed to get user status of message acceptance", err);
        return Response.json(
            {
                success: false,
                message: "Failed to get user status of message acceptance",
            },
            { status: 500 }
        );
    }
}


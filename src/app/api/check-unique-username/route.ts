import { client } from "@/lib/db";
import { usernameSchema } from "@/schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameSchema
})

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        const { success, error, data } = usernameQuerySchema.safeParse(queryParams);
        if(!success) {
            const usernameErrors = error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors
            }, {status: 411})
        } 
        const { username } = data;
        const verifiedUser = await client.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        });
        if(verifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }
        return Response.json({
            success: true,
            message: "Username is available"
        })
    } catch (err) {
        console.error("Error checking username", err);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}
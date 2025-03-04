import { client } from "@/lib/db";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { success, error } = verifySchema.safeParse(data);
        if(success) {
            const { username, code } = data;
            const user = await client.user.findFirst({
                where: {
                    username
                }
            });
            if(!user) {
                return Response.json({
                    success: false,
                    message: "User not found"
                })
            }
            const isCodeValid = user.verifyCode === code;
            const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
            if(isCodeValid && isCodeNotExpired) {
                await client.user.update({
                    where: {
                        id: user.id
                    }, data: {
                        isVerified: true
                    }
                });
                return Response.json({
                    success: true,
                    message: "User verified successfully"
                });
            } else if (!isCodeValid) {
                return Response.json({
                    success: false,
                    message: "Incorrect code"
                }, {status: 411});
            } else {
                return Response.json({
                    success: false,
                    message: "Code expired, signup again to get a new one"
                }, {status: 411});
            }
        } else {
            return Response.json({
                success: false,
                message: error.message
            })
        }
        
    } catch (err) {
        console.error("Error verifying user", err);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {status: 500})
    }
}
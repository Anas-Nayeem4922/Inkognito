import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { client } from "@/lib/db";
import { signupSchema } from "@/schemas/signupSchema";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { success, error } = signupSchema.safeParse(data);
        if(success) {
            const { username, email, password } = data;
            const existingUserVerifiedUsername = await client.user.findFirst({
                where: {
                    username,
                    isVerified: true
                }
            });
            if(existingUserVerifiedUsername) {
                return Response.json({
                    success: false,
                    message: "Username is already taken"
                }, {status: 400});
            }
            const existingUserByEmail = await client.user.findFirst({
                where: {
                    email
                }
            });
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            if(existingUserByEmail) {
                if (existingUserByEmail.isVerified) {
                    return Response.json({
                        success: false,
                        message: "User already exists with this email"
                    }, {status: 400})
                } else {
                    const hashedPassword = await bcrypt.hash(password, 3);
                    await client.user.update({
                        where: { id: existingUserByEmail.id },
                        data: {
                            password: hashedPassword,
                            verifyCode,
                            verifyCodeExpiry: new Date(Date.now() + 3600000)
                        }
                    });
                }
            } else {
                const hashedPassword = await bcrypt.hash(password, 3);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                await client.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpiry: expiryDate
                    }
                })
            }
            // Send verification email
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            if(!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
                }, {status: 500})
            }
            return Response.json({
                success: true,
                message: "User registered successfully. Please verify your email"
            }, {status: 201})
        } else {
            return Response.json({
                success: false,
                message: error
            }, {status: 411});
        }
    } catch (error) {
        console.error("Error in registering user", error);
        return Response.json({
            success: false,
            message: "Error in registering user"
        }, {
            status: 500
        })
    }
}

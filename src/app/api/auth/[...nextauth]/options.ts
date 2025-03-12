import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { client } from "@/lib/db";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(client),
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"identifier" | "password", string> | undefined) {
                if(!credentials) {
                    return null
                }
                try {
                    const user = await client.user.findUnique({
                        where: {
                            email: credentials.identifier
                        }
                    });
                    if(!user) {
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified) {
                        throw new Error("Please verify your account first");
                    } 
                    const result = await bcrypt.compare(credentials.password, user.password);
                    if(!result) {
                        throw new Error("Password is incorrect")
                    }
                    return user;
                } catch (error) {
                    throw new Error((error as Error).message);
                }
            }
        })
    ],
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
                session.user.username = token.username as string

            }
            return session
        }
        
    }
}
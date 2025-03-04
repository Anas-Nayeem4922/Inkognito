import { z } from "zod"

export const usernameSchema = z.string().min(2, "Username must contain more than 2 characters").max(20, "Username must contain less than 20 characters")

export const signupSchema = z.object({
    username: usernameSchema,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, "Password must contain more than 6 characters")
})
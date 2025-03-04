import { z } from "zod";
import { usernameSchema } from "./signupSchema";

export const messageSchema = z.object({
    username: usernameSchema,
    content: z.string().min(10, "Content must be atleast 10 characters").max(300, "Content must be no longer than 300 characters")
})
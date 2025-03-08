import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(5, "Content must be atleast 5 characters").max(300, "Content must be no longer than 300 characters")
})
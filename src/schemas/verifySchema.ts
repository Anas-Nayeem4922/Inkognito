import { z } from "zod";
import { usernameSchema } from "./signupSchema";

export const verifySchema = z.object({
    username: usernameSchema,
    code: z.string().length(6, "Verification code must be six digits")
})
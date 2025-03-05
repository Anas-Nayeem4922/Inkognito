import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'inkognito@ezzcrafts.com',
            to: email,
            subject: 'Verification code from Inkognito',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification email sent successfully" }
        
    } catch (error) {
        console.error("Error sending verificaton email", error);
        return { success: false, message: "Failed to send verification mail" }
    }
}
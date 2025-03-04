import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptMessages?: boolean,
    messages?: Array<Message> 
}
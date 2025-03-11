import { Message } from "@prisma/client";


export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptMessages?: boolean,
    messages?: Array<Message> 
}
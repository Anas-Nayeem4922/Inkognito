"use client"

import { useParams } from "next/navigation"

export default function Message() {
    const params = useParams<{username: string}>();
    return <div>
        {params.username}
    </div>
}
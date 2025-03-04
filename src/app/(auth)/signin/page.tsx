"use client"

import { useSession } from "next-auth/react"

export default function Signin() {
    const { data: session, status } = useSession()

    if (status === "authenticated") {
        return <p>Signed in as {session.user.email}</p>
    }

    return <div>
        <div>Not signed in</div>
        <a className="bg-amber-200 text-3xl text-black p-4 rounded-md" href="/api/auth/signin">Sign in</a>
    </div>
    
}
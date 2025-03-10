"use client"

import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User
    return <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl font-bold mb-4 md:mb-0" href="#">Inkognito</a>
            {
                session ? (
                    <>
                        <span className="mr-4">Welcome {user.username}</span>
                        <Button className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <Link href="/signin">
                        <Button className="w-full md:w-auto">Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
}
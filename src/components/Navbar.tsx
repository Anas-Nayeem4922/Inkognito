"use client"

import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import Link from "next/link"
import { UserCircle2, LogOut, LogIn } from "lucide-react"

export default function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <Link 
                        href="/" 
                        className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
                    >
                        <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            Inkognito
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center">
                        {session ? (
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 min-w-0">
                                    <UserCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                                        {user.username}
                                    </span>
                                </div>
                                <Button 
                                    variant="outline"
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 sm:px-4"
                                    size="sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <Link href="/signin">
                                <Button 
                                    variant="default"
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all px-3 sm:px-4"
                                    size="sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="text-sm sm:text-base">Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
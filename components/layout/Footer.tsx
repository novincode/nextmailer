import Link from 'next/link'
import React from 'react'

const Footer = () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Newsletter"
    return (
        <footer className="border-t bg-muted/40">
            <div className="container flex flex-col gap-4 py-10 md:h-24 md:flex-row md:items-center md:justify-between md:py-0">
                <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:items-center">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} {appName}. All rights reserved.
                    </p>
                </div>
                <nav className="flex items-center justify-center gap-4">
                    <Link href="/privacy-policy" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground/80">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground/80">
                        Terms of Service
                    </Link>
                    <Link href="/unsubscribe" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground/80">
                        Unsubscribe
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
"use client";

import { usePathname } from "next/navigation";

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    const authRoutes = ["/login", "/cadastro", "/esqueci-senha", "/nova-senha"];

    if (authRoutes.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
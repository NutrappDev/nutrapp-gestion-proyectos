'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface AuthProviderClientProps {
    children: ReactNode;
}

export default function AuthProviderClient({ children }: AuthProviderClientProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return <AuthProvider>{children}</AuthProvider>;
}
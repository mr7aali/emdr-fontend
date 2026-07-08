"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/assessment/phq9');
    }, [router]);

    return <div className="flex h-screen items-center justify-center">Loading Assessment...</div>;
}

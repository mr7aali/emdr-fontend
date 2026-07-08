"use client";
import { AssessmentProvider } from '@/context/AssessmentContext';

export default function AssessmentLayout({ children }) {
    return (
        <AssessmentProvider>
            {children}
        </AssessmentProvider>
    );
}

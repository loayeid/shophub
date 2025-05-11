'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const UnauthorizedPage = () => {
    const router = useRouter();
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>403 - Unauthorized</h1>
            <p style={styles.message}>
                You do not have permission to access this page.
            </p>
            <button style={styles.button} onClick={() => (router.push('/'))}>
                Go to Homepage
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center' as const,
        backgroundColor: '#f8f9fa',
        color: '#333',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.25rem',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
    },
};

export default UnauthorizedPage;
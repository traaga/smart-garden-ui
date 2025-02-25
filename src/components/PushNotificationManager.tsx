'use client'

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from '../api-client';
import { BellRing, BellOff, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const LoadingSpinner = ({ className }: { className: string }) => {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>);
}

export function PushNotificationManager() {
    const [loading, setLoading] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null,
    );

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
            updateViaCache: 'none',
        });
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
    }

    async function subscribeToPush() {
        setLoading(true);
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            ),
        });
        setSubscription(sub);
        const serializedSub = JSON.parse(JSON.stringify(sub));
        await subscribeUser(serializedSub);
        setLoading(false);
    }

    async function unsubscribeFromPush() {
        setLoading(true);
        await subscription?.unsubscribe();
        setSubscription(null);
        await unsubscribeUser();
        setLoading(false);
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification();
        }
    }

    if (!isSupported) {
        return (
            <></>
        );
    }

    if (loading) {
        return LoadingSpinner({className: ''});
    }

    return (
        <div className='flex gap-4'>
            {subscription ? (
                <>
                    {process.env.NODE_ENV === 'development' && <Send onClick={sendTestNotification} />}
                    <BellRing onClick={unsubscribeFromPush} />
                </>
            ) : (
                <BellOff onClick={subscribeToPush} />
            )}
        </div>
    );
}

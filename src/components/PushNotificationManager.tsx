'use client'

import { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from '../api-client';
import { Button } from './ui/button';

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

export function PushNotificationManager() {
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
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe();
        setSubscription(null);
        await unsubscribeUser();
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification();
        }
    }

    if (!isSupported) {
        return (
            <p>Push notifications are not supported in this browser.</p>
        );
    }

    return (
        <div className='flex flex-col gap-2'>
            <h3 className='font-bold'>Push Notifications <span className='text-gray-400'>(testing)</span></h3>
            {subscription ? (
                <>
                    <p>You are subscribed to push notifications.</p>
                    <div>
                        <Button onClick={unsubscribeFromPush}>Unsubscribe</Button>
                        <Button onClick={sendTestNotification} className='ml-2'>Send Test</Button>
                    </div>
                </>
            ) : (
                <>
                    <p>You are not subscribed to push notifications.</p>
                    <div>
                        <Button onClick={subscribeToPush}>Subscribe</Button>
                    </div>
                </>
            )}
        </div>
    )
}

import dotenv from 'dotenv';
import { Config, HistoryMeasurements, NodeItem } from './common';

dotenv.config();

export const getOnlineNodes = async (): Promise<NodeItem[]> => {
    if(process.env.NODE_ENV === 'development') {
        return [{
            id: "00000000000000000000000000000000",
            name: "test-node",
            imageUrl: "../plant-512x768.jpg",
            showWarning: false,
            fields: {
                moisture: 75,
            },
        }];
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/online-nodes', {
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error((error as Error).message);
    }
    return [];
};

export const getConfig = async (id: string): Promise<Config | null> => {
    if(process.env.NODE_ENV === 'development') {
        return {
            id: "00000000000000000000000000000000",
            name: "test-node",
            version: 9,
            interval: 900,
            led_state: false,
            imageUrl: "../plant-512x768.jpg",
            soilMoistureThreshold: null,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/config?id=' + id, {
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error((error as Error).message);
    }
    return null;
};

export const updateConfig = async (config: Config): Promise<void> => {
    if(process.env.NODE_ENV === 'development') {
        return;
    }

    try {
        const {
            id,
            name,
            interval,
            led_state,
            soilMoistureThreshold,
        } = config;

        const body = {
            name,
            interval,
            led_state,
            soilMoistureThreshold: soilMoistureThreshold || null,
        };

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/config?id=' + id, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
};

export const getCurrentMeasurements = async (id: string): Promise<{[key: string]: number} | null> => {
    if(process.env.NODE_ENV === 'development') {
        return {
            moisture: 75,
        };
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/current-measurements?id=' + id, {
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error((error as Error).message);
    }
    return null;
};

export const getHistoryMeasurements = async (id: string): Promise<HistoryMeasurements | null> => {
    if(process.env.NODE_ENV === 'development') {
        return {
            day: [{
                datetime: new Date().toISOString(),
                moisture: 25,
            }],
            week: [{
                datetime: new Date().toISOString(),
                moisture: 50,
            }],
            month: [{
                datetime: new Date().toISOString(),
                moisture: 75,
            }],
        };
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/history-measurements?id=' + id, {
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error((error as Error).message);
    }
    return null;
};

export const uploadImage = async (formData: FormData): Promise<void> => {
    if(process.env.NODE_ENV === 'development') {
        return;
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/upload-image', {
            method: "POST",
            body: formData,
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
};

export const getImageSource = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url, {
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            },
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const blob = await response.blob();
    
        const reader = new FileReader();

        await new Promise((resolve, reject) => {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        return reader.result as string;
    } catch (error) {
        console.error((error as Error).message);
    }
    return '';
};

export const subscribeUser = async (sub: PushSubscription): Promise<void> => {
    if(process.env.NODE_ENV === 'development') {
        return;
    }

    try {
        const deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            throw new Error('No device id found');
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/subscription', {
            method: "PUT",
            body: JSON.stringify({
                id: deviceId,
                data: JSON.stringify(sub),
            }),
            headers: {
                'Content-Type': 'application/json',
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
};

export const unsubscribeUser = async (): Promise<void> => {
    if(process.env.NODE_ENV === 'development') {
        return;
    }

    try {
        const deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            throw new Error('No device id found');
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/subscription?id=' + deviceId, {
            method: "DELETE",
            headers: {
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
};

// FOR TESTING
export const sendNotification = async (): Promise<void> => {
    if(process.env.NODE_ENV === 'development') {
        return;
    }

    try {
        const deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            throw new Error('No device id found');
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/subscription', {
            method: "POST",
            body: JSON.stringify({
                ids: [deviceId],
                message: {
                    title: 'Test Node',
                    body: 'Test message',
                    icon: '/icon.svg',
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                'CF-Access-Client-Id': process.env.NEXT_PUBLIC_CF_AUTH_ID || '',
                'CF-Access-Client-Secret': process.env.NEXT_PUBLIC_CF_AUTH_TOKEN || ''
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error((error as Error).message);
    }
};

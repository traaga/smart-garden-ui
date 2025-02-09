import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Smart Garden',
        short_name: 'Smart Garden',
        description: 'A Progressive Web App built with Next.js',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                "src": "apple-touch-icon.png",
                "sizes": "any",
                "type": "image/png"
            },
            {
                "src": "apple-touch-icon-120x120.png",
                "sizes": "any",
                "type": "image/png"
            },
        ],
    }
}

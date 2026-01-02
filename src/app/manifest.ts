import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Osamari',
        short_name: 'Osamari',
        description: '面倒な割り勘計算を一瞬で解決。旅行やイベントの精算アプリ。',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        scope: '/',
        icons: [
            {
                src: '/icon.jpg',
                sizes: 'any',
                type: 'image/jpeg',
            },
        ],
    };
}

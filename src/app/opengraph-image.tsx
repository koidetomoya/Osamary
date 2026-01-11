import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Osamary - 最小回数で割り勘精算';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #fdfbf7, #e2e8f0)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ffffff',
                        borderRadius: '50px',
                        padding: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        marginBottom: '40px',
                    }}
                >
                    {/* Simple icon representation or just text if logo unavailable */}
                    <div style={{ fontSize: 60, marginRight: 20 }}>💸</div>
                    <div style={{ fontSize: 80, fontWeight: 'bold', color: '#1a202c' }}>Osamary</div>
                </div>
                <div style={{ fontSize: 40, color: '#4a5568', fontWeight: '500' }}>
                    最小回数で、スマートに割り勘。
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

import { ImageResponse } from 'next/og';
import OpengraphImage, { size as ogSize, alt as ogAlt, contentType as ogContentType } from './opengraph-image';

export const runtime = 'edge';
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
    return OpengraphImage();
}

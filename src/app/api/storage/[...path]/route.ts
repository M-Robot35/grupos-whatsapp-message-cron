import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Serve arquivos estáticos da pasta storage/ do projeto.
 * URL: /storage/{userId}/ads/{adId}/0.jpg
 * Arquivo: {cwd}/storage/{userId}/ads/{adId}/0.jpg
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await params
    const filePath = path.resolve(process.cwd(), 'storage', ...segments)

    // Impede path traversal
    const baseDir = path.resolve(process.cwd(), 'storage')
    if (!filePath.startsWith(baseDir)) {
        return new NextResponse('Forbidden', { status: 403 })
    }

    try {
        const buffer = await fs.readFile(filePath)
        const ext = segments[segments.length - 1].split('.').pop()?.toLowerCase() ?? 'bin'
        const mimeMap: Record<string, string> = {
            jpg: 'image/jpeg', jpeg: 'image/jpeg',
            png: 'image/png', webp: 'image/webp',
            gif: 'image/gif', avif: 'image/avif',
        }
        const contentType = mimeMap[ext] ?? 'application/octet-stream'
        return new NextResponse(buffer, {
            headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
        })
    } catch {
        return new NextResponse('Not Found', { status: 404 })
    }
}

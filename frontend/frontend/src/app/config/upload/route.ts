import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

// รองรับ method POST
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const file = formData.get('firmware') as File
    const version = formData.get('version') as string

    if (!file || !version) {
      return NextResponse.json({ error: 'Missing firmware or version' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const firmwarePath = path.join(process.cwd(), 'public', 'firmware.bin')
    const versionPath = path.join(process.cwd(), 'public', 'version.txt')

    await writeFile(firmwarePath, buffer)
    await writeFile(versionPath, version.trim())

    return new NextResponse('✅ Upload success', { status: 200 })
  } catch (err) {
    console.error('Upload error:', err)
    return new NextResponse('❌ Upload failed', { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(process.cwd(), 'src', 'resources', ...params.path);

  try {
    const file = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}

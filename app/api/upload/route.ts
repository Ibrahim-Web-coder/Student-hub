import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const path = formData.get('path') as string || 'documents';

    if (!file || !bucket) {
      return NextResponse.json({ error: 'File and bucket are required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Allowed: images, PDF, Word, Excel' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Save file record to database
    const schoolId = formData.get('school_id') as string;
    const userId = formData.get('user_id') as string;

    if (schoolId) {
      await supabase.from('files').insert({
        school_id: schoolId,
        user_id: userId || null,
        name: fileName,
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: fileName,
        public_url: urlData.publicUrl,
        entity_type: formData.get('entity_type') as string || null,
        entity_id: formData.get('entity_id') as string || null,
      });
    }

    return NextResponse.json({
      path: data.path,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Execute a lightweight query to ensure the Supabase PostgreSQL database stays active
    const { data, error } = await supabase.from('societies').select('id, name').limit(1);

    if (error) {
      return NextResponse.json(
        { 
          status: 'degraded', 
          timestamp: new Date().toISOString(), 
          message: 'Database query returned an error or uninitialized tables',
          error: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      societies_found: data?.length || 0,
      keepalive: 'active'
    });
  } catch (err: any) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(), 
        message: err?.message || 'Unexpected server error' 
      },
      { status: 500 }
    );
  }
}


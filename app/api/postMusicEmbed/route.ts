import postMusicEmbed from '@/lib/neynar/postMusicEmbed';
import verifySignerUUID from '@/lib/neynar/verifySigner';
import { NextRequest, NextResponse } from 'next/server';

const getResponse = async (req: NextRequest): Promise<NextResponse> => {
  console.log('getResponse sweets!!!')

  const body = await req.json();
  const { signer_uuid, url } = body;
  console.log('signer_uuid', signer_uuid)
  console.log('url', url)  
  console.log('postMusicEmbed')


  const data = await postMusicEmbed(signer_uuid, url);

  return NextResponse.json(
    {
      message: `success`,
      data
    },
    { status: 200 },
  );
};

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
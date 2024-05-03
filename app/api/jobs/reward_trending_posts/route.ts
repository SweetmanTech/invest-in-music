import getFeedFromTime from '@/lib/neynar/getFeedFromTime';
import { StackClient } from '@stackso/js-core';
import { createClient } from '@supabase/supabase-js';
import { isEmpty, isNil } from 'lodash';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;
const TIP_AWARD_PER = 2500;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY as string,
  pointSystemId: Number(process.env.STACK_SYSTEM_ID),
});

const getResponse = async (): Promise<NextResponse> => {
  const topPosts = await fetchTopPosts();

  if (isNil(topPosts)) return NextResponse.json({ message: 'No top posts' }, { status: 400 });

  for(var i = 0; i < topPosts.length; i++) {
    const post = topPosts[i];
    const verifications = post.verifications;
    if (!isNil(verifications) && verifications.length > 0) {
        const authorWallet = verifications[0];
        stack.track(`trending_reward_${authorWallet}`, { account: authorWallet, points: TIP_AWARD_PER });
    }
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
};



async function fetchTopPosts() {
  const oneDayAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')  // Selects all columns; specify columns if needed e.g. 'id, title, likes'
    .gt('created_at', oneDayAgo.toISOString())  // Assuming 'created_at' is the column name
    .order('likes', { ascending: false })  // Orders by 'likes' in descending order
    .limit(10);  // Limits to top 10

  if (error) {
    console.error('Error fetching posts:', error);
    return null;
  }

  return data;
}
  
export async function GET(): Promise<Response> {
  await getResponse().catch((error) => {
    console.error('Error in background task:', error);
  });
  return NextResponse.json({ message: 'success' }, { status: 200 });
}
  
export const dynamic = 'force-dynamic';
  
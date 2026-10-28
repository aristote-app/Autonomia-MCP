import {NextResponse} from 'next/server';
import {createAuthServerClient} from '../../../lib/auth/server.js';
import {safeInternalPath} from '../../../lib/auth/redirect.js';
export async function GET(request){
 const url=new URL(request.url);const code=url.searchParams.get('code');const next=safeInternalPath(url.searchParams.get('next'));
 if(code){const client=await createAuthServerClient();const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(next,url.origin),303);}
 return NextResponse.redirect(new URL('/login?error=confirmation_failed&next='+encodeURIComponent(next),url.origin),303);
}

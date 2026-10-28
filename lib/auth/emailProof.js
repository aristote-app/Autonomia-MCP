// Parse a supplied proof locally. Never fetch a user-supplied URL.
export function parseEmailProof(received,email){
 const value=String(received||'').trim();
 if(/^\d{6,8}$/.test(value))return {email,token:value,type:'email'};
 const link=new URL(value);
 if(link.protocol!=='https:'||!['haazpzbwcryaksgtormn.supabase.co','cockpit.build-autonomia.com'].includes(link.hostname)||link.username||link.password)throw new Error('Invalid sign-in link');
 const tokenHash=link.searchParams.get('token_hash')||link.searchParams.get('token');
 const type=link.searchParams.get('type');
 if(!tokenHash||tokenHash.length>2000||!['email','magiclink'].includes(type))throw new Error('Invalid sign-in link');
 return {token_hash:tokenHash,type};
}

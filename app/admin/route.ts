import html from '../../lib/admin.html?raw';
import { getChatGPTUser } from '../chatgpt-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const user=await getChatGPTUser();
 if(!user)return Response.redirect(new URL('/signin-with-chatgpt?return_to=%2Fadmin',request.url));
 if(user.email.toLowerCase()!=='chenqw213@gmail.com')return new Response('只有网站拥有者可以进入后台。',{status:403});
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Frame-Options':'SAMEORIGIN'}});
}

import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user||user.email.toLowerCase()!=='chenqw213@gmail.com')return json({error:'只有网站拥有者可以上传作品。'},403);
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'请求来源无效。'},403);
 if(Number(request.headers.get('Content-Length')||0)>6*1024*1024)return json({error:'图片不能超过 5 MB。'},413);
 try{const form=await request.formData();const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>5*1024*1024)return json({error:'请选择 5 MB 以内的图片。'},400);
 const bytes=new Uint8Array(await file.arrayBuffer());let extension='',type='';
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b)){extension='png';type='image/png'}
 else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){extension='jpg';type='image/jpeg'}
 else if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'){extension='webp';type='image/webp'}
 else return json({error:'仅支持 JPG、PNG、WebP 图片。'},400);
 const key=crypto.randomUUID()+'.'+extension;await env.BUCKET!.put(key,bytes,{httpMetadata:{contentType:type}});return json({url:'/media/'+key});
 }catch{return json({error:'上传失败，请重试。'},503);}
}

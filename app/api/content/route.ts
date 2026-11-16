import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { defaults, validateContent, withTranslations } from '../../../lib/content';
export const dynamic = 'force-dynamic';
const json = (value: unknown, status=200) => Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
  try { const row=await env.DB!.prepare('SELECT content, revision, updated_at FROM portfolio WHERE id=1').first<{content:string,revision:number,updated_at:string}>(); const data=withTranslations(row?{...JSON.parse(row.content),revision:row.revision,savedAt:row.updated_at}:{...defaults,revision:0});const user=await getChatGPTUser();if(user?.email.toLowerCase()!=='chenqw213@gmail.com')data.projects=data.projects.filter((p:any)=>p.published);return json(data); }
  catch { return json({error:'内容暂时无法读取，请稍后重试。'},503); }
}
export async function PUT(request:Request){
  const user=await getChatGPTUser();
  if(!user || user.email.toLowerCase()!=='chenqw213@gmail.com') return json({error:'只有网站拥有者可以修改内容。'},403);
  if(request.headers.get('Origin')!==new URL(request.url).origin || request.headers.get('Content-Type')?.split(';')[0]!=='application/json')return json({error:'请求来源无效。'},403);
  if(Number(request.headers.get('Content-Length')||0)>300000)return json({error:'内容过长。'},413);
  try{
    const input:any=await request.json(); const content=validateContent(input); const revision=input.revision;
    if(!Number.isInteger(revision)||revision<0)throw Error('版本无效，请重新载入。');
    const now=new Date().toISOString(); const serialized=JSON.stringify(content);
    if(serialized.length>250000)throw Error('内容过长。');
    const result=revision===0
      ? await env.DB!.prepare('INSERT INTO portfolio (id, content, revision, updated_by, updated_at) VALUES (1, ?, 1, ?, ?) ON CONFLICT(id) DO NOTHING').bind(serialized,user.userId,now).run()
      : await env.DB!.prepare('UPDATE portfolio SET content=?, revision=revision+1, updated_by=?, updated_at=? WHERE id=1 AND revision=?').bind(serialized,user.userId,now,revision).run();
    if(!result.meta.changes)return json({error:'内容已在其他页面更新。请先备份当前文字，再刷新页面。'},409);
    return json({revision:revision+1,savedAt:now});
  }catch(error){return json({error:error instanceof Error?error.message:'保存失败，请重试。'},400);}
}

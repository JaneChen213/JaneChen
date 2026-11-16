import resume from "./resume.json";
import translated from "./translations.json";
export const translatedFields={researchArea:150,researchIntro:4000,researchKeywords:600,researchLinkLabel:150,name:60,heroTitle:150,heroIntro:500,introTitle:150,introLead:300,intro:6000,skills:1000,education:6000,qualifications:2000,location:100,availability:300,socialLabel:150,contactNote:1000};
const projectFields={title:180,subtitle:240,description:6000};
export function withTranslations(content:any){
 content={researchArea:resume.researchArea,researchIntro:resume.researchIntro,researchKeywords:resume.researchKeywords,researchLink:resume.researchLink,researchLinkLabel:resume.researchLinkLabel,...content};
 const translations:any={};const source:any=translated;const base:any=resume;
 for(const lang of ['ko','en']){translations[lang]={...(content.translations?.[lang]||{})};for(const key of Object.keys(translatedFields)){if(!(key in translations[lang])&&content[key]===base[key])translations[lang][key]=source[lang][key]||'';}}
 return {...content,translations,projects:content.projects.map((p:any)=>{const original=base.projects.find((v:any)=>v.id===p.id);const perLang:any={};for(const lang of ['ko','en']){perLang[lang]={...(p.translations?.[lang]||{})};for(const key of Object.keys(projectFields)){if(!(key in perLang[lang])&&original&&p[key]===original[key])perLang[lang][key]=source[lang].projects[p.id]?.[key]||'';}}return {...p,translations:perLang};})};
}
export const defaults=withTranslations(resume);
export function validateContent(input:any){
  const str=(v:any,max:number)=>{if(typeof v!=='string'||v.length>max)throw Error('字段格式不正确或文字过长。');return v.trim()};
  const localized=(value:any,limits:Record<string,number>)=>{const out:any={};for(const lang of ['ko','en']){out[lang]={};for(const [key,max] of Object.entries(limits)){if(value?.[lang]?.[key]!==undefined)out[lang][key]=str(value[lang][key],max);}}return out};
  const safeLink=(v:any)=>{const value=str(v,1000);if(value){let u;try{u=new URL(value)}catch{throw Error("链接格式不正确。")}if(u.protocol!=="https:")throw Error("链接必须以 https:// 开头。");}return value};
  const name=str(input.name,60);if(!name)throw Error('请填写网站名称。');
  const email=str(input.email,150);if(email&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw Error('请填写有效邮箱。');
  const socialUrl=str(input.socialUrl,1000);if(socialUrl){let u;try{u=new URL(socialUrl)}catch{throw Error('社交链接格式不正确。')}if(u.protocol!=='https:')throw Error('社交链接必须以 https:// 开头。');}
  if(!Array.isArray(input.projects)||input.projects.length>60)throw Error('最多可管理 60 个作品。');
  const seen=new Set();const projects=input.projects.map((p:any)=>{
    const id=str(p.id,80);if(!/^[\w-]+$/.test(id)||seen.has(id))throw Error('作品编号重复或无效。');seen.add(id);
    const title=str(p.title,100);if(!title)throw Error('请填写作品标题。');
    if(!['brand','digital','editorial'].includes(p.category))throw Error('请选择有效分类。');
    const image=str(p.image,200);if(image&&!/^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(image))throw Error('请重新上传作品图片。');
    return {id,title,translations:localized(p.translations,projectFields),subtitle:str(p.subtitle,160),category:p.category,year:str(p.year,40),description:str(p.description,6000),image,link:safeLink(p.link||""),demo:[0,1,2].includes(p.demo)?p.demo:null,published:p.published===true};
  });
  return {name,researchArea:str(input.researchArea??defaults.researchArea,150),researchIntro:str(input.researchIntro??defaults.researchIntro,4000),researchKeywords:str(input.researchKeywords??defaults.researchKeywords,600),researchLink:safeLink(input.researchLink??defaults.researchLink),researchLinkLabel:str(input.researchLinkLabel??defaults.researchLinkLabel,150),translations:localized(input.translations,translatedFields),heroTitle:str(input.heroTitle??defaults.heroTitle,150),heroIntro:str(input.heroIntro??defaults.heroIntro,500),education:str(input.education??defaults.education,6000),qualifications:str(input.qualifications??defaults.qualifications,2000),phone:str(input.phone??defaults.phone,50),location:str(input.location??defaults.location,100),availability:str(input.availability??defaults.availability,300),introTitle:str(input.introTitle,150),introLead:str(input.introLead,300),intro:str(input.intro,6000),skills:str(input.skills,500),email,socialLabel:str(input.socialLabel,80),socialUrl,contactNote:str(input.contactNote,1000),projects};
}

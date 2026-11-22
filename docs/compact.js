(()=>{
const text={
zh:{selected:'精选作品',work:'工作案例',video:'视频作品',allWork:'查看全部工作案例',allVideo:'查看全部视频',allWorkTitle:'全部工作案例',allVideoTitle:'全部视频作品',more:'查看完整履历',bio:'关于我与学习经历',close:'关闭',workIntro:'中韩市场经验与内容运营成果。',videoIntro:'代表剪辑作品，更多作品点击查看。',about:'关于',contact:'联系',research:'研究',summary:'市场与新媒体运营 · 中韩项目经验',workPreview:'工作案例精选',videoPreview:'视频作品精选'},
ko:{selected:'주요 작업',work:'업무 사례',video:'영상 작품',allWork:'모든 업무 사례 보기',allVideo:'모든 영상 보기',allWorkTitle:'전체 업무 사례',allVideoTitle:'전체 영상 작품',more:'전체 소개 및 학력 보기',bio:'소개 및 학력',close:'닫기',workIntro:'한중 마케팅과 소셜 미디어 운영 경험입니다.',videoIntro:'주요 편집 영상입니다. 전체 작품도 확인해 보세요.',about:'소개',contact:'문의',research:'연구',summary:'마케팅·소셜 미디어 운영 · 한중 프로젝트 경험',workPreview:'주요 업무 사례',videoPreview:'주요 영상 작품'},
en:{selected:'Selected work',work:'Case studies',video:'Video edits',allWork:'View all case studies',allVideo:'View all videos',allWorkTitle:'All case studies',allVideoTitle:'All video edits',more:'Read my full profile',bio:'Profile & education',close:'Close',workIntro:'China–Korea projects and content operations.',videoIntro:'Selected edits. Explore the full collection for more.',about:'About',contact:'Contact',research:'Research',summary:'Marketing & social media · China–Korea experience',workPreview:'Selected case studies',videoPreview:'Selected video edits'}};
const make=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=value;if(cls)n.className=cls;return n};
const mobile=matchMedia('(max-width:700px)');let selected='work',current=null;
let collection;
function closeCollection(){if(collection?.open)collection.close();}
function prepareDialog(t,title){
 if(!collection){collection=make('dialog',undefined,'collection-dialog');collection.id='collection-dialog';collection.setAttribute('aria-labelledby','collection-title');document.body.append(collection);collection.addEventListener('close',()=>{document.body.classList.remove('collection-open');});collection.addEventListener('click',e=>{if(e.target===collection){const r=collection.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)collection.close();}});}
 collection.replaceChildren();const header=make('div',undefined,'collection-header'),h=make('h2',title);h.id='collection-title';const close=make('button',t.close,'collection-close');close.type='button';close.onclick=()=>collection.close();header.append(h,close);const body=make('div',undefined,'collection-body');collection.append(header,body);return body;
}
function showCollection(kind){
 const {content,t}=current;
 const body=prepareDialog(t,kind==='work'?t.allWorkTitle:kind==='videos'?t.allVideoTitle:t.bio);
 if(kind==='work'){
  const list=make('div',undefined,'collection-work-list');for(const p of content.projects.filter(p=>p.published&&!/bilibili\.com\/.*video\//.test(p.link||''))){const b=make('button',undefined,'collection-work-item');b.type='button';if(p.image){const img=make('img');img.src=p.image;img.alt='';img.loading='lazy';b.append(img);}const label=make('span',undefined,'collection-work-copy');label.append(make('strong',p.title),make('span',p.subtitle),make('small',p.year));b.append(label);b.onclick=()=>{collection.close();document.getElementById('case-'+p.id)?.querySelector('.case-trigger')?.click();};list.append(b);}body.append(list);
 }else if(kind==='videos'){
  const grid=make('div',undefined,'collection-video-grid');for(const card of document.querySelectorAll('#video-gallery>.video-card')){const clone=card.cloneNode(true);clone.classList.remove('preview-hidden');grid.append(clone);}body.append(grid);
 }else{
  const profile=make('article',undefined,'full-profile');profile.append(make('h3',content.introTitle),make('p',content.introLead),make('p',content.intro));
  for(const [heading,value]of [[ui().educationTitle,content.education],[ui().qualifications,content.qualifications],[ui().research,content.researchArea+'\n'+content.researchIntro]])if(value)profile.append(make('h3',heading),make('p',value));
  if(content.researchLink){const a=make('a',content.researchLinkLabel||ui().research,'profile-resource');a.href=content.researchLink;a.target='_blank';a.rel='noopener noreferrer';profile.append(a);}body.append(profile);
 }
 document.body.classList.add('collection-open');collection.showModal();collection.scrollTop=0;
}
function limitedWork(){const cards=[...document.querySelectorAll('.projects>.project')].filter(p=>!p.hidden);cards.forEach((p,i)=>p.classList.toggle('preview-hidden',i>=2));}
window.limitPortfolioWork=limitedWork;
function adapt(){
 if(!current)return;const {t,language,content}=current;
 const work=document.querySelector('#work'),nav=document.querySelector('header nav'),videoNav=nav.querySelector('.video-nav');
 const heading=work.querySelector('.section-heading .heading-main');if(heading)heading.textContent=mobile.matches?t.selected:wordsForWork(language);
 work.classList.toggle('show-video-preview',mobile.matches&&selected==='videos');
 document.querySelector('#featured-work-tab').setAttribute('aria-selected',String(selected==='work'));document.querySelector('#featured-video-tab').setAttribute('aria-selected',String(selected==='videos'));document.querySelector('#featured-work-tab').tabIndex=selected==='work'?0:-1;document.querySelector('#featured-video-tab').tabIndex=selected==='videos'?0:-1;
 document.querySelector('#featured-work-panel').hidden=mobile.matches&&selected!=='work';document.querySelector('#featured-video-panel').hidden=!mobile.matches||selected!=='videos';
 const logo=document.querySelector('header .logo');logo.firstChild.textContent=mobile.matches?({zh:'陈茜文 Jane',ko:'제인 Jane',en:'Jane Chen'})[language]:content.name;
 const labels={zh:['简体中文','한국어','English'],ko:['简体中文','한국어','English'],en:['简体中文','한국어','English']}[language];
 [...document.querySelectorAll('[data-lang]')].forEach((b,i)=>{b.textContent=mobile.matches?['中','한','EN'][i]:labels[i];b.setAttribute('aria-label',labels[i]);});
 if(videoNav){videoNav.href=mobile.matches?'#work':'#videos';videoNav.onclick=()=>{if(mobile.matches){selected='videos';adapt();}};}
 const workNav=nav.querySelector('[href="#work"]:not(.video-nav)');if(workNav){workNav.firstChild.textContent=(mobile.matches?t.selected:wordsForWork(language))+' ';workNav.onclick=()=>{selected='work';adapt();};}
 nav.querySelector('[href="#about"]').textContent=mobile.matches?t.about:({zh:'关于我',ko:'소개',en:'About'})[language];nav.querySelector('[href="#contact"]').textContent=mobile.matches?t.contact:({zh:'联系合作',ko:'협업 문의',en:'Contact'})[language];
 const metric=document.querySelector('.impact-item:nth-child(3) .impact-label');if(metric){metric.dataset.fullLabel??=metric.textContent;metric.textContent=mobile.matches?({zh:'2个月播放量',ko:'2개월 조회수',en:'Views · 2 mo.'})[language]:metric.dataset.fullLabel;}
 limitedWork();
}
function wordsForWork(language){return {zh:'工作案例',ko:'업무 사례',en:'Case studies'}[language];}
mobile.addEventListener('change',adapt);
window.compactPortfolio=(content)=>{
 const language=({en:'en',ko:'ko'})[document.documentElement.lang]||'zh',t=text[language];current={content,t,language};closeCollection();
 document.querySelector('#work .section-heading p').textContent=t.workIntro;document.querySelector('#videos-intro').textContent=t.videoIntro;
 for(const p of content.projects.filter(p=>p.published&&!/bilibili\.com\/.*video\//.test(p.link||''))){const article=document.getElementById('case-'+p.id);article?.querySelector('.compact-outcome')?.remove();if(article){const outcome=make('p',p.subtitle,'compact-outcome');article.querySelector('.case-detail').before(outcome);}}
 const work=document.querySelector('#work');let tabs=work.querySelector('.featured-tabs');if(!tabs){tabs=make('div',undefined,'featured-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',t.selected);work.querySelector('.section-heading').after(tabs);for(const [id,kind]of [['featured-work-tab','work'],['featured-video-tab','videos']]){const b=make('button');b.id=id;b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-controls',kind==='work'?'featured-work-panel':'featured-video-panel');b.onclick=()=>{selected=kind;adapt();};b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selected=selected==='work'?'videos':'work';adapt();document.querySelector(selected==='work'?'#featured-work-tab':'#featured-video-tab').focus();}};tabs.append(b);}}
 document.querySelector('#featured-work-tab').textContent=t.work;document.querySelector('#featured-video-tab').textContent=t.video;
 let panel=document.querySelector('#featured-work-panel');if(!panel){panel=make('div');panel.id='featured-work-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','featured-work-tab');work.append(panel);panel.append(work.querySelector('.filters'),work.querySelector('.projects'));}
 panel.querySelector('.all-work')?.remove();const allWork=make('button',t.allWork+' ('+content.projects.filter(p=>p.published&&!/bilibili\.com\/.*video\//.test(p.link||'')).length+')','collection-entry all-work');allWork.type='button';allWork.onclick=()=>showCollection('work');panel.append(allWork);
 let videoPanel=document.querySelector('#featured-video-panel');if(!videoPanel){videoPanel=make('div');videoPanel.id='featured-video-panel';videoPanel.setAttribute('role','tabpanel');videoPanel.setAttribute('aria-labelledby','featured-video-tab');work.append(videoPanel);}videoPanel.replaceChildren();
 const preview=make('div',undefined,'mobile-video-grid');for(const card of [...document.querySelectorAll('#video-gallery>.video-card')].slice(0,2))preview.append(card.cloneNode(true));videoPanel.append(preview);const allVideos=()=>{const b=make('button',t.allVideo+' ('+document.querySelectorAll('#video-gallery>.video-card').length+')','collection-entry');b.type='button';b.onclick=()=>showCollection('videos');return b;};videoPanel.append(allVideos());
 document.querySelector('#videos .all-videos')?.remove();const videoEntry=allVideos();videoEntry.classList.add('all-videos');document.querySelector('#video-gallery').after(videoEntry);
 document.querySelector('.profile-entry')?.remove();
 for(const item of document.querySelectorAll('.impact-source')){const id=item.getAttribute('href')?.slice(1);item.onclick=e=>{e.preventDefault();closeCollection();document.getElementById(id)?.querySelector('.case-trigger')?.click();};}
 // Keep the existing six-video order and all owner-managed content behind the entries.
 document.querySelector('.hero .eyebrow').textContent='MARKETING / CONTENT / COMMUNICATION';
 document.querySelectorAll('.hero-actions a[href="#work"]').forEach(a=>{a.onclick=()=>{selected='work';adapt();};});
 adapt();
};
})();

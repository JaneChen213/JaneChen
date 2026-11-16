import html from '../public/portfolio/index.html?raw';
export function GET() { return new Response(html.replace('href="style.css"','href="/portfolio/style.css"').replace('src="script.js"','src="/portfolio/script.js"'), { headers: {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'} }); }

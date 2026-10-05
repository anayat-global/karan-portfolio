"""One-off: extract the 7 service pages + services index from the legacy PHP site backup
into content-seed/services.json (clean semantic HTML bodies)."""
import json, re, sys
from bs4 import BeautifulSoup, Comment
B='/Users/harwindersingh/Anayat/allWebsites/karan-backup-2026-10-05/site/www.karandeeparora.com/'
SERVICES=[
 ('wordpress-development-services','WordPress Development'),
 ('twilio-development-services','Twilio Development'),
 ('react-js-development-services','React JS Development'),
 ('python-development-services','Python Development'),
 ('php-development-services','PHP Development'),
 ('magento-development-services','Magento Development'),
 ('backend-development-services','Backend Development'),
]
def clean(t): return re.sub(r'\s+',' ',t).strip()
out=[]
for order,(slug,name) in enumerate(SERVICES):
    s=BeautifulSoup(open(B+slug+'.html',errors='ignore'),'lxml')
    for t in s(['script','style','noscript']): t.decompose()
    for c in s.find_all(string=lambda x:isinstance(x,Comment)): c.extract()
    h1=s.find('h1')
    stop=None
    for cand in s.find_all(class_=re.compile('testimonial')):
        stop=cand;break
    # collect nodes in doc order after h1 until stop
    started=False; html=[]; hero_sub=None; seen=set()
    BLOCK=['div','p','h1','h2','h3','h4','ul','ol','li','section','table']
    for el in s.find_all(['h1','h2','h3','h4','p','li','div']):
        if el.name=='div' and (el.find(BLOCK) is not None): continue
        if el is h1: started=True; continue
        if not started: continue
        if stop is not None and stop in el.parents: break
        if stop is not None and el is stop: break
        if el.name=='li' and el.find_parent(['ul','ol']) is None: continue
        txt=clean(el.get_text(' '))
        if not txt or txt in seen and el.name!='li': continue
        if re.search(r'lorem ipsum',txt,re.I): continue
        if el.find_parent(['header','footer','nav']) or el.find_parent(class_=re.compile(r'faqs?-section|footer|(^|-)menu|sidebar')): continue
        if txt in ('Hire a Freelancer','Hire Me','Contact Me','Let\'s talk','Read More','Question & Answers'): continue
        if el.name=='p' and el.find_parent('li'): 
            continue
        seen.add(txt)
        if hero_sub is None and el.name=='h3':
            hero_sub=txt; continue
        nm='divt' if el.name=='div' and re.search('title|heading',' '.join(el.get('class',[]))) else el.name
        html.append((nm,txt,False))
    # build html, grouping li into ul
    parts=[];inul=False
    for n,t,_ in html:
        if n=='li':
            if not inul: parts.append('<ul>');inul=True
            parts.append(f'<li>{t}</li>')
        else:
            if inul: parts.append('</ul>');inul=False
            tag={'h2':'h2','h3':'h3','h4':'h3','p':'p','divt':'h3'}.get(n,'p')
            parts.append(f'<{tag}>{t}</{tag}>')
    if inul: parts.append('</ul>')
    out.append({'slug':slug,'title':name,'hero':hero_sub,'order':order,'content':'\n'.join(parts)})
json.dump(out,open('content-seed/services.json','w'),indent=1,ensure_ascii=False)
for o in out: print(o['slug'],'|',o['hero'],'|',len(o['content']),'chars', o['content'].count('<h'),'headings')

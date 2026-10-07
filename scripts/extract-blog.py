"""One-off: extract legacy blog posts into content-seed/blog.json."""
import json, re, glob, os
from bs4 import BeautifulSoup, Comment
B='/Users/harwindersingh/Anayat/allWebsites/karan-backup-2026-10-05/site/www.karandeeparora.com/blog/'
SKIP={'inner-blog','why-is-reactjs-the-supreme-framework-in-2024-for-your-business-app-development.php'}  # dup/template pages
out=[]
for f in sorted(glob.glob(B+'*.html')):
    slug=os.path.basename(f)[:-5]
    if slug in SKIP: continue
    s=BeautifulSoup(open(f,errors='ignore'),'lxml')
    title_tag=(s.title.get_text().strip() if s.title else '')
    md=s.find('meta',attrs={'name':'description'}); kw=s.find('meta',attrs={'name':'keywords'})
    left=s.find(class_='left-section')
    if not left: print('NO BODY',slug); continue
    for c in left.find_all(string=lambda x:isinstance(x,Comment)): c.extract()
    h=left.find('h3'); title=re.sub(r'\s+',' ',h.get_text()).strip(); h.decompose()
    for t in left(['script','style']): t.decompose()
    for share in left.find_all(class_=re.compile('share')): share.decompose()
    img=s.select_one('.blog-image-section img')
    date=s.select_one('.post-date span')
    for a in left.find_all(True):
        for k in list(a.attrs):
            if k not in ('href','src','alt'): del a.attrs[k]
    body=left.decode_contents().strip()
    body=re.sub(r'\n\s*\n+','\n',re.sub(r'<br\s*/?>','',body))
    out.append({'slug':slug,'title':title,'seoTitle':re.sub(r'\s*\|\s*Blog\s*$','',title_tag),
      'metaDescription':re.sub(r'\s+',' ',md['content']).strip() if md else '',
      'metaKeywords':kw['content'].strip() if kw else '',
      'image':(img['src'].replace('../','/') if img else None),
      'dateLabel':date.get_text().strip() if date else '', 'content':body})
json.dump(out,open('content-seed/blog.json','w'),indent=1,ensure_ascii=False)
for o in out: print(o['slug'][:60],'|',o['dateLabel'],'|',o['image'],'|',len(o['content']),'|',bool(o['metaDescription']))

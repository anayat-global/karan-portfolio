"""One-off: add ISO dates, meta descriptions, excerpts, headlines to the extracted seed JSON."""
import json,re
from datetime import date
MONTHS={m:i+1 for i,m in enumerate('january february march april may june july august september october november december'.split())}
def trunc(t,n):
    t=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',t)).strip()
    if len(t)<=n: return t
    c=t[:n]; return c[:c.rfind(' ')].rstrip(',;:')+'…'
blog=json.load(open('content-seed/blog.json'))
for b in blog:
    m=re.match(r'([a-z]+)\s+(\d+)\w*,?\s+(\d{4})',b['dateLabel'],re.I)
    b['publishDate']=date(int(m[3]),MONTHS[m[1].lower()],int(m[2])).isoformat()
    first=re.search(r'<p[^>]*>(.*?)</p>',b['content'],re.S)
    b['excerpt']=trunc(first[1] if first else b['content'],200)
    if not b['metaDescription']: b['metaDescription']=trunc(first[1] if first else b['content'],155)
    words=len(re.sub(r'<[^>]+>',' ',b['content']).split()); b['readTime']=f"{max(1,round(words/200))} min read"
    if b['image']: b['image']=b['image'].replace('php%20har','php-har').replace('fullsatck%20de','fullstack-de')
    del b['dateLabel']
json.dump(blog,open('content-seed/blog.json','w'),indent=1,ensure_ascii=False)
HEAD={'wordpress-development-services':'Hire the Best WordPress Developer in India',
'twilio-development-services':'Twilio Development, API Services and Integration to Streamline Your Communication',
'react-js-development-services':'Build Complex Apps with React JS Development Services',
'python-development-services':'Python Website Development Services to Build Apps for a Small Business',
'php-development-services':'Next-level PHP Development Services to Create Dynamic Content',
'magento-development-services':'Design a Modern E-Commerce Store with Custom Magento Development Services',
'backend-development-services':'Back-End Development Services to Support your Business Needs'}
sv=json.load(open('content-seed/services.json'))
for s in sv:
    s['shortDescription']=HEAD[s['slug']]
    first=re.search(r'<p>(.*?)</p>',s['content'],re.S)
    s['metaDescription']=trunc(first[1],155)
    s.pop('hero',None)
json.dump(sv,open('content-seed/services.json','w'),indent=1,ensure_ascii=False)
print([ (b['publishDate'],b['readTime']) for b in blog][:4]); print(sv[1]['metaDescription'])

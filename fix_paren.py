import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('test_campus.js',encoding='utf-8').read()
print('before:',c.count('('),c.count(')'))
c=c.replace('})));}))):null);','}));}))):null);')
print('after:',c.count('('),c.count(')'))
open('test_campus.js','w',encoding='utf-8').write(c)
r=subprocess.run(['node','--check','test_campus.js'],capture_output=True,text=True)
print('JS:',r.returncode)
if r.returncode!=0:
    print(r.stderr[-300:])
else:
    print('JS OK - now injecting into HTML')
    h=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
    start=h.find('function CampusesBuilder(')
    chunk=h[start:start+10000]
    offset=chunk.find('\nfunction ')
    end=start+offset
    h=h[:start]+c+h[end:]
    open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(h)
    scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',h)
    open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
    r2=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
    if r2.returncode==0:
        subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
        subprocess.run(['git','commit','-m','Wire CampusesBuilder to Railway CRUD'])
        subprocess.run(['git','push'])
        print('DONE.')
    else:
        print('HTML ERROR:',r2.stderr[-200:])
        subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
        print('RESTORED.')

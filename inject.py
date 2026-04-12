import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
js=open('test_campus.js',encoding='utf-8').read()
h=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
start=h.find('function CampusesBuilder(')
chunk=h[start:start+10000]
end=start+chunk.find('\nfunction ')
print('injecting',len(js),'chars, replacing',end-start,'chars')
h=h[:start]+js+h[end:]
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(h)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',h)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
print('HTML check:',r.returncode)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Wire CampusesBuilder to Railway CRUD'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-300:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

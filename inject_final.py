import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
new_component=open('campus_new.js',encoding='utf-8').read()
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
start=c.find('function CampusesBuilder(')
chunk=c[start:start+10000]
nl=chr(10)
offset=chunk.find(nl+'function ')
end=start+offset
print('Replacing',end-start,'chars with',len(new_component),'chars')
c=c[:start]+new_component+c[end:]
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write(nl.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Replace CampusesBuilder with Railway CRUD panel'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

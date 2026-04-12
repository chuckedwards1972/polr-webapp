import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('hope-place-port-allen',700000)
start=c.rfind('var ',0,idx)
end=c.find(';',idx)+1
old=c[start:end]
new='var CAMPUS_CONFIGS = [];'
print('replacing',len(old),'chars with',len(new))
c=c.replace(old,new,1)
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Clear hardcoded CAMPUS_CONFIGS - load from Railway'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

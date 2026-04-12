import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
old="var keys=['hope_session','polr_session','hope_token'];for(var i=0;i<keys.length;i++){var s=sessionStorage.getItem(keys[i])||localStorage.getItem(keys[i]);if(s){var parsed=JSON.parse(s);if(parsed.token)return parsed.token;}}return '';"
new="var t=sessionStorage.getItem('hope_token')||localStorage.getItem('hope_token');if(t)return t;var s=sessionStorage.getItem('hope_session')||localStorage.getItem('hope_session');if(s){try{return JSON.parse(s).token||'';}catch(e){}}return '';"
c=c.replace(old,new)
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Fix token key - use hope_token for Railway auth'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

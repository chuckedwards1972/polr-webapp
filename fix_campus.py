import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
old='.catch(function(e){setLoading(false);toast({icon:"warning",title:"Could not load campuses",body:"Check connection."});});'
new='.catch(function(e){setLoading(false);toast({icon:"warning",title:"Campus load error",body:String(e)});console.error("Campus fetch error:",e);});'
c=c.replace(old,new,1)
old2='sessionStorage.getItem("hope_session")'
new2='sessionStorage.getItem("hope_session")||localStorage.getItem("hope_session")'
c=c.replace(old2,new2,1)
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Add campus fetch error display and localStorage fallback'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

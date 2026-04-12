import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
old='case \'campuses\':'
new='case \'campuses\':'
idx=c.find('function getSession()')
insert='''
function loadCampusesFromDB(platform,update,toast){
  var tok=(function(){try{var s=sessionStorage.getItem("hope_session");return s?JSON.parse(s).token||"":"";}catch(e){return "";}})();
  fetch(window.POLR_API_BASE+"/admin/campuses",{headers:{"Authorization":"Bearer "+tok}})
    .then(function(r){return r.json();})
    .then(function(data){if(Array.isArray(data)&&data.length>0){update("campuses",data);toast({icon:"ok",title:"Campuses loaded",body:data.length+" campuses loaded from database."});}})
    .catch(function(e){console.log("Campus load error",e);});
}
'''
c=c[:idx]+insert+c[idx:]
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
print('check:',r.returncode)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Add loadCampusesFromDB helper function'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

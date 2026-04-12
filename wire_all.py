import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()

# Find where session/login happens and inject bulk data load
# After successful login, fetch all entities from Railway
old_login = "function getSession()"
api_loader = """function loadAllFromRailway(update,toast){
  var tok=function(){try{var s=sessionStorage.getItem('hope_session')||localStorage.getItem('hope_session');return s?JSON.parse(s).token||'':'';}catch(e){return '';}};
  var base=window.POLR_API_BASE;
  var hdr={'Authorization':'Bearer '+tok()};
  var load=function(path,key){
    fetch(base+path,{headers:hdr})
      .then(function(r){return r.json();})
      .then(function(data){if(Array.isArray(data)&&data.length>0){update(key,data);console.log('Loaded',data.length,key,'from Railway');}})
      .catch(function(e){console.log('Failed to load',key,e);});
  };
  load('/members','members');
  load('/housing','housing');
  load('/workforce/employers','employers');
  load('/workforce/placements','placements');
  load('/financial/donations','donations');
  load('/meetings','meetings');
  load('/admin/campuses','campuses');
}
"""
if 'loadAllFromRailway' not in c:
    c=c.replace(old_login, api_loader+old_login, 1)
    print('loadAllFromRailway injected.')

# Now call it after login succeeds - find where session is set after login
old_login_success = "setSession(data);"
new_login_success = "setSession(data);setTimeout(function(){loadAllFromRailway(update,toast);},500);"
if old_login_success in c and 'loadAllFromRailway(update' not in c:
    c=c.replace(old_login_success, new_login_success, 1)
    print('Login hook injected.')
elif 'loadAllFromRailway(update' in c:
    print('Login hook already present.')

open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Wire all dashboard panels to Railway on login'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

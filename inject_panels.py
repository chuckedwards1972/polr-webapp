import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()

def replace_panel(html, fn_name, new_fn):
    idx=html.find('function '+fn_name+'(')
    if idx<0:
        target='function getSession()'
        print(fn_name+' not found - injecting before getSession')
        return html.replace(target,new_fn+chr(10)+target,1)
    chunk=html[idx:idx+100000]
    import re as r2
    nxt=r2.search(r'\nfunction \w+',chunk[10:])
    end=idx+(nxt.start()+1 if nxt else len(chunk))
    print('Replaced '+fn_name+' ('+str(end-idx)+' -> '+str(len(new_fn))+' chars)')
    return html[:idx]+new_fn+html[end:]

panels=open('all_panels.js',encoding='utf-8').read()

def get_fn(js,name):
    idx=js.find('function '+name+'(')
    if idx<0:return None
    import re as r2
    nxt=r2.search(r'\nfunction \w+',js[idx+10:])
    return js[idx:idx+(nxt.start()+1 if nxt else len(js)-idx)]

for fn in ['MeetingsBuilder','HousingBuilder','DonationsPanel','GrantEngine','EmployersBuilder']:
    fn_code=get_fn(panels,fn)
    if fn_code:
        c=replace_panel(c,fn,fn_code)
    else:
        print('WARNING: '+fn+' not found in all_panels.js')

open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Wire Meetings Housing Donations Grants Employers to Railway'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-300:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

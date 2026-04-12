import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
old_form="INP('Meeting Day','meeting_day'),INP('Meeting Time','meeting_time')"
new_form="INP('Meeting Day','meeting_day'),INP('Meeting Start Time','meeting_time'),INP('Meeting End Time','meeting_end_time')"
if old_form in c:
    c=c.replace(old_form,new_form,1)
    print('Meeting end time added.')
else:
    print('NOT FOUND - checking what is there:')
    idx=c.find('meeting_day')
    print(repr(c[idx-10:idx+100]))
old_blank="meeting_day:'',meeting_time:'',parish:''"
new_blank="meeting_day:'',meeting_time:'',meeting_end_time:'',parish:''"
if old_blank in c:
    c=c.replace(old_blank,new_blank,1)
    print('Blank updated.')
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Add meeting start/end time to campus form'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

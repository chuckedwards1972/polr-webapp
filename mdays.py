import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()

old_days="INP('Meeting Day','meeting_day'),INP('Meeting Start Time','meeting_time'),INP('Meeting End Time','meeting_end_time')"

new_days=("React.createElement('div',{style:{gridColumn:'1 / -1'}}," +
"React.createElement('div',{style:{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--dmuted)',marginBottom:'0.4rem'}},'MEETING SCHEDULE')," +
"(form.meeting_days||[{day:'',start:'',end:''}]).map(function(md,i){" +
"return React.createElement('div',{key:i,style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'0.4rem',marginBottom:'0.4rem'}}," +
"React.createElement('input',{type:'text',placeholder:'Day (e.g. Monday)',value:md.day||'',onChange:function(e){var days=[].concat(form.meeting_days||[{day:'',start:'',end:''}]);days[i]=Object.assign({},days[i],{day:e.target.value});setForm(function(p){return Object.assign({},p,{meeting_days:days});});},style:{padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none'}})," +
"React.createElement('input',{type:'text',placeholder:'Start (6:00 PM)',value:md.start||'',onChange:function(e){var days=[].concat(form.meeting_days||[{day:'',start:'',end:''}]);days[i]=Object.assign({},days[i],{start:e.target.value});setForm(function(p){return Object.assign({},p,{meeting_days:days});});},style:{padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none'}})," +
"React.createElement('input',{type:'text',placeholder:'End (7:00 PM)',value:md.end||'',onChange:function(e){var days=[].concat(form.meeting_days||[{day:'',start:'',end:''}]);days[i]=Object.assign({},days[i],{end:e.target.value});setForm(function(p){return Object.assign({},p,{meeting_days:days});});},style:{padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none'}})," +
"React.createElement('button',{onClick:function(){var days=[].concat(form.meeting_days||[]);days.splice(i,1);if(days.length===0)days=[{day:'',start:'',end:''}];setForm(function(p){return Object.assign({},p,{meeting_days:days});});},style:{padding:'0.4rem 0.6rem',borderRadius:6,border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.08)',color:'#ef4444',cursor:'pointer',fontSize:'0.8rem'}},'x'));" +
"})," +
"React.createElement('button',{onClick:function(){var days=[].concat(form.meeting_days||[{day:'',start:'',end:''}]);days.push({day:'',start:'',end:''});setForm(function(p){return Object.assign({},p,{meeting_days:days});});},style:{padding:'0.3rem 0.75rem',fontSize:'0.75rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg2)',color:'var(--dtxt)',cursor:'pointer',marginTop:'0.25rem'}},'+ Add Day'))")

if old_days in c:
    c=c.replace(old_days,new_days,1)
    print('Multiple days added.')
else:
    print('NOT FOUND')

old_blank="meeting_day:'',meeting_time:'',meeting_end_time:'',parish:''"
new_blank="meeting_days:[{day:'',start:'',end:''}],meeting_day:'',meeting_time:'',meeting_end_time:'',parish:''"
c=c.replace(old_blank,new_blank,1)

open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
r=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
if r.returncode==0:
    subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
    subprocess.run(['git','commit','-m','Add multiple meeting days to campus form'])
    subprocess.run(['git','push'])
    print('DONE.')
else:
    print('ERROR:',r.stderr[-200:])
    subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
    print('RESTORED.')

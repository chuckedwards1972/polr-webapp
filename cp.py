import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
start=c.find('function CampusesBuilder(')
chunk=c[start:start+10000]
offset=chunk.find('\nfunction ')
end=start+offset
new=''
new+='function CampusesBuilder(p){'
new+='var toast=p.toast;'
new+='var _cs=React.useState([]);var campuses=_cs[0];var setCampuses=_cs[1];'
new+='var _lo=React.useState(true);var loading=_lo[0];var setLoading=_lo[1];'
new+='var _sf=React.useState(false);var showForm=_sf[0];var setShowForm=_sf[1];'
new+='var _ed=React.useState(null);var editing=_ed[0];var setEditing=_ed[1];'
new+='var blank={name:"",city:"",state:"LA",address:"",phone:"",director:"",meeting_day:"",meeting_time:""};'
new+='var _fm=React.useState(blank);var form=_fm[0];var setForm=_fm[1];'
new+='var getToken=function(){try{var s=sessionStorage.getItem("hope_session");return s?JSON.parse(s).token||"":"";}catch(e){return "";}};'
new+='var API=window.POLR_API_BASE;'
new+='var load=function(){setLoading(true);fetch(API+"/admin/campuses",{headers:{"Authorization":"Bearer "+getToken()}}).then(function(r){return r.json();}).then(function(data){setCampuses(Array.isArray(data)?data:[]);setLoading(false);}).catch(function(e){setLoading(false);});};'
new+='React.useEffect(function(){load();},[]);'
new+='var ff=function(k){return function(e){setForm(function(prev){var n=Object.assign({},prev);n[k]=e.target.value;return n;});};};'
new+='var toggleForm=function(){setShowForm(function(v){return !v;});setEditing(null);setForm(blank);};'
new+='var save=function(){if(!form.name||!form.city){toast({icon:"warning",title:"Required",body:"Name and city required."});return;}var url=editing?API+"/admin/campuses/"+editing:API+"/admin/campuses";var method=editing?"PUT":"POST";fetch(url,{method:method,headers:{"Content-Type":"application/json","Authorization":"Bearer "+getToken()},body:JSON.stringify(form)}).then(function(r){return r.json();}).then(function(){toast({icon:"ok",title:"Saved",body:form.name+" saved."});setShowForm(false);setEditing(null);setForm(blank);load();}).catch(function(e){toast({icon:"warning",title:"Failed"});});};'
new+='var startEdit=function(x){setForm({name:x.name||"",city:x.city||"",state:x.state||"LA",address:x.address||"",phone:x.phone||"",director:x.director||"",meeting_day:x.meeting_day||"",meeting_time:x.meeting_time||""});setEditing(x.id);setShowForm(true);};'
new+='var deact=function(id,n){fetch(API+"/admin/campuses/"+id,{method:"DELETE",headers:{"Authorization":"Bearer "+getToken()}}).then(function(){toast({icon:"ok",title:"Deactivated",body:n+" deactivated."});load();}).catch(function(e){toast({icon:"warning",title:"Failed"});});};'
new+='var INP=function(lbl,k){return React.createElement("div",{style:{marginBottom:"0.5rem"}},React.createElement("div",{style:{fontSize:"0.6rem",fontWeight:700,textTransform:"uppercase",color:"var(--dmuted)",marginBottom:"0.1rem"}},lbl),React.createElement("input",{type:"text",value:form[k]||"",onChange:ff(k),style:{width:"100%",padding:"0.4rem",borderRadius:6,border:"1px solid var(--bdr2)",background:"var(--bg3)",color:"var(--dtxt)",fontSize:"0.82rem",outline:"none",boxSizing:"border-box"}}));};'
new+='return React.createElement("div",null,'
new+='React.createElement("div",{className:"d-card-head"},React.createElement("span",{className:"d-card-title"},"HOPE Places"),React.createElement("button",{className:"btn-primary",onClick:toggleForm,style:{padding:"0.4rem 0.85rem",fontSize:"0.78rem"}},showForm?"Cancel":"+ Add HOPE Place")),'
new+='loading?React.createElement("div",{style:{padding:"1rem",color:"var(--dmuted)"}},"Loading..."):null,'
new+='showForm?React.createElement("div",{className:"d-card",style:{marginBottom:"1rem"}},React.createElement("div",{style:{fontSize:"0.65rem",color:"var(--dmuted)",marginBottom:"0.5rem"}},editing?"EDIT":"NEW HOPE PLACE"),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}},INP("Name","name"),INP("Director","director"),INP("Address","address"),INP("City","city"),INP("Phone","phone"),INP("Meeting Day","meeting_day"),INP("Meeting Time","meeting_time"),INP("State","state")),React.createElement("button",{className:"btn-primary",onClick:save,style:{marginTop:"0.5rem"}},editing?"Save Changes":"Add Campus")):null,'
new+='!loading?React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginTop:"1rem"}},campuses.filter(function(x){return x.is_active;}).map(function(x){return React.createElement("div",{key:x.id,className:"d-card"},React.createElement("div",{style:{fontWeight:700,color:"var(--gold)",marginBottom:"0.35rem"}},x.name),React.createElement("div",{style:{fontSize:"0.78rem",color:"var(--dmuted)",lineHeight:1.7}},x.director?React.createElement("div",null,"Director: "+x.director):null,x.city?React.createElement("div",null,x.city+", "+x.state):null,x.meeting_day?React.createElement("div",null,x.meeting_day+"s at "+(x.meeting_time||"")):null,x.phone?React.createElement("div",null,x.phone):null),React.createElement("div",{style:{display:"flex",gap:"0.35rem",marginTop:"0.5rem"}},React.createElement("button",{onClick:function(){startEdit(x);},style:{padding:"0.2rem 0.5rem",fontSize:"0.7rem",borderRadius:5,border:"1px solid var(--bdr2)",background:"var(--bg2)",color:"var(--dtxt)",cursor:"pointer"}},"Edit"),React.createElement("button",{onClick:function(){deact(x.id,x.name);},style:{padding:"0.2rem 0.5rem",fontSize:"0.7rem",borderRadius:5,border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.08)",color:"#ef4444",cursor:"pointer"}},"Remove")));}))):null);'
new+='}'
opens=new.count('(')
closes=new.count(')')
print('opens:',opens,'closes:',closes)
open('test_campus.js','w',encoding='utf-8').write(new)
r=subprocess.run(['node','--check','test_campus.js'],capture_output=True,text=True)
print('JS check:',r.returncode)
if r.returncode!=0:
    print(r.stderr[-200:])
else:
    c=c[:start]+new+c[end:]
    open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
    scripts=re.findall(r'(?s)<script[^>]*>(.*?)</script>',c)
    open('polr-check.js','w',encoding='utf-8').write('\n'.join(scripts))
    r2=subprocess.run(['node','--check','polr-check.js'],capture_output=True,text=True)
    if r2.returncode==0:
        subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
        subprocess.run(['git','commit','-m','Wire CampusesBuilder to Railway CRUD'])
        subprocess.run(['git','push'])
        print('DONE.')
    else:
        print('HTML ERROR:',r2.stderr[-200:])
        subprocess.run(['git','checkout','origin/main','--','POLR-WIRED-ENHANCED.html'])
        print('RESTORED.')

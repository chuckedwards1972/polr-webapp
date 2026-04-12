function CampusesBuilder(p){
  var platform=p.platform,addToList=p.addToList,removeFromList=p.removeFromList,updateInList=p.updateInList,toast=p.toast;
  var _cs=React.useState([]);var campuses=_cs[0];var setCampuses=_cs[1];
  var _lo=React.useState(true);var loading=_lo[0];var setLoading=_lo[1];
  var _sf=React.useState(false);var showForm=_sf[0];var setShowForm=_sf[1];
  var _ed=React.useState(null);var editing=_ed[0];var setEditing=_ed[1];
  var _er=React.useState('');var error=_er[0];var setError=_er[1];
  var blank={name:'',city:'',state:'LA',address:'',zip:'',phone:'',email:'',director:'',meeting_day:'',meeting_time:'',parish:''};
  var _fm=React.useState(blank);var form=_fm[0];var setForm=_fm[1];
  var getToken=function(){
    try{
      var s=sessionStorage.getItem('hope_session')||localStorage.getItem('hope_session')||sessionStorage.getItem('polr_session')||localStorage.getItem('polr_session');
      if(s){var parsed=JSON.parse(s);return parsed.token||parsed.access_token||'';}
      return '';
    }catch(e){return '';}
  };
  var API=window.POLR_API_BASE||'https://polr-backend-production.up.railway.app/api';
  var load=function(){
    setLoading(true);
    setError('');
    var tok=getToken();
    fetch(API+'/admin/campuses',{headers:{'Authorization':'Bearer '+tok,'Content-Type':'application/json'}})
      .then(function(r){
        if(!r.ok)throw new Error('HTTP '+r.status);
        return r.json();
      })
      .then(function(data){
        setCampuses(Array.isArray(data)?data:[]);
        setLoading(false);
      })
      .catch(function(e){
        setLoading(false);
        setError('Could not load campuses: '+String(e));
      });
  };
  React.useEffect(function(){load();},[]);
  var ff=function(k){return function(e){setForm(function(prev){var n=Object.assign({},prev);n[k]=e.target.value;return n;});};};
  var toggleForm=function(){setShowForm(function(v){return !v;});setEditing(null);setForm(blank);};
  var save=function(){
    if(!form.name||!form.city){toast({icon:'warning',title:'Required',body:'Name and city required.'});return;}
    var url=editing?API+'/admin/campuses/'+editing:API+'/admin/campuses';
    var method=editing?'PUT':'POST';
    fetch(url,{method:method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify(form)})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
      .then(function(){toast({icon:'ok',title:'Saved',body:form.name+' saved.'});setShowForm(false);setEditing(null);setForm(blank);load();})
      .catch(function(e){toast({icon:'warning',title:'Save failed',body:String(e)});});
  };
  var startEdit=function(x){
    setForm({name:x.name||'',city:x.city||'',state:x.state||'LA',address:x.address||'',zip:x.zip||'',phone:x.phone||'',email:x.email||'',director:x.director||'',meeting_day:x.meeting_day||'',meeting_time:x.meeting_time||'',parish:x.parish||''});
    setEditing(x.id);setShowForm(true);
  };
  var deact=function(id,n){
    fetch(API+'/admin/campuses/'+id,{method:'DELETE',headers:{'Authorization':'Bearer '+getToken()}})
      .then(function(){toast({icon:'ok',title:'Deactivated',body:n+' deactivated.'});load();})
      .catch(function(e){toast({icon:'warning',title:'Failed',body:String(e)});});
  };
  var INP=function(lbl,k){
    return React.createElement('div',{style:{marginBottom:'0.5rem'}},
      React.createElement('div',{style:{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--dmuted)',marginBottom:'0.1rem'}},lbl),
      React.createElement('input',{type:'text',value:form[k]||'',onChange:ff(k),style:{width:'100%',padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none',boxSizing:'border-box'}}));
  };
  return React.createElement('div',null,
    React.createElement('div',{className:'d-card-head'},
      React.createElement('span',{className:'d-card-title'},'HOPE Places — Live'),
      React.createElement('div',{style:{display:'flex',gap:'0.5rem'}},
        React.createElement('button',{onClick:load,style:{padding:'0.35rem 0.65rem',fontSize:'0.75rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg2)',color:'var(--dtxt)',cursor:'pointer'}},'Refresh'),
        React.createElement('button',{className:'btn-primary',onClick:toggleForm,style:{padding:'0.4rem 0.85rem',fontSize:'0.78rem'}},showForm?'Cancel':'+ Add HOPE Place'))),
    error?React.createElement('div',{style:{padding:'0.75rem',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,color:'#ef4444',fontSize:'0.8rem',marginBottom:'1rem'}},error):null,
    loading?React.createElement('div',{style:{padding:'1rem',color:'var(--dmuted)'}},'Loading from database...'):null,
    showForm?React.createElement('div',{className:'d-card',style:{marginBottom:'1rem'}},
      React.createElement('div',{style:{fontSize:'0.65rem',color:'var(--dmuted)',marginBottom:'0.5rem'}},editing?'EDIT CAMPUS':'NEW HOPE PLACE'),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}},
        INP('Campus Name','name'),INP('Director','director'),INP('Address','address'),INP('City','city'),INP('Parish','parish'),INP('Zip','zip'),INP('Phone','phone'),INP('Email','email'),INP('Meeting Day','meeting_day'),INP('Meeting Time','meeting_time')),
      React.createElement('button',{className:'btn-primary',onClick:save,style:{marginTop:'0.5rem'}},editing?'Save Changes':'Add Campus')):null,
    !loading?React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'1rem'}},
      campuses.filter(function(x){return x.is_active;}).map(function(x){
        return React.createElement('div',{key:x.id,className:'d-card'},
          React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}},
            React.createElement('div',{style:{fontWeight:700,color:'var(--gold)',fontSize:'0.9rem'}},x.name),
            React.createElement('div',{style:{display:'flex',gap:'0.35rem'}},
              React.createElement('button',{onClick:function(){startEdit(x);},style:{padding:'0.2rem 0.5rem',fontSize:'0.7rem',borderRadius:5,border:'1px solid var(--bdr2)',background:'var(--bg2)',color:'var(--dtxt)',cursor:'pointer'}},'Edit'),
              React.createElement('button',{onClick:function(){deact(x.id,x.name);},style:{padding:'0.2rem 0.5rem',fontSize:'0.7rem',borderRadius:5,border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.08)',color:'#ef4444',cursor:'pointer'}},'Remove'))),
          React.createElement('div',{style:{fontSize:'0.78rem',color:'var(--dmuted)',lineHeight:1.7}},
            x.director?React.createElement('div',null,'Director: '+x.director):null,
            x.address?React.createElement('div',null,x.address+', '+x.city+' '+x.state):null,
            x.parish?React.createElement('div',null,'Parish: '+x.parish):null,
            x.meeting_day?React.createElement('div',null,x.meeting_day+'s at '+(x.meeting_time||'')):null,
            x.phone?React.createElement('div',null,x.phone):null));})):null);
}

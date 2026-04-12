function MembersFullPanel({platform,update,toast,session}){
  var _cs=React.useState([]);var members=_cs[0];var setMembers=_cs[1];
  var _lo=React.useState(true);var loading=_lo[0];var setLoading=_lo[1];
  var _sf=React.useState(false);var showForm=_sf[0];var setShowForm=_sf[1];
  var _ed=React.useState(null);var editing=_ed[0];var setEditing=_ed[1];
  var _sr=React.useState('');var search=_sr[0];var setSearch=_sr[1];
  var blank={first_name:'',last_name:'',email:'',phone:'',campus_id:'',level:6,status:'intake'};
  var _fm=React.useState(blank);var form=_fm[0];var setForm=_fm[1];
  var getToken=function(){try{var s=sessionStorage.getItem('hope_session')||localStorage.getItem('hope_session');return s?JSON.parse(s).token||'':'';}catch(e){return '';}};
  var API=window.POLR_API_BASE;
  var load=function(){
    setLoading(true);
    fetch(API+'/members',{headers:{'Authorization':'Bearer '+getToken()}})
      .then(function(r){return r.json();})
      .then(function(data){setMembers(Array.isArray(data)?data:[]);setLoading(false);})
      .catch(function(e){setLoading(false);toast({icon:'warning',title:'Could not load members',body:String(e)});});
  };
  React.useEffect(function(){load();},[]);
  var ff=function(k){return function(e){setForm(function(p){var n=Object.assign({},p);n[k]=e.target.value;return n;});};};
  var toggleForm=function(){setShowForm(function(v){return !v;});setEditing(null);setForm(blank);};
  var save=function(){
    if(!form.first_name||!form.last_name){toast({icon:'warning',title:'Required',body:'First and last name required.'});return;}
    var url=editing?API+'/members/'+editing:API+'/members';
    var method=editing?'PUT':'POST';
    fetch(url,{method:method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify(form)})
      .then(function(r){return r.json();})
      .then(function(){toast({icon:'ok',title:'Saved',body:form.first_name+' '+form.last_name+' saved.'});setShowForm(false);setEditing(null);setForm(blank);load();})
      .catch(function(e){toast({icon:'warning',title:'Save failed',body:'Check connection.'});});
  };
  var startEdit=function(x){
    setForm({first_name:x.first_name||'',last_name:x.last_name||'',email:x.email||'',phone:x.phone||'',campus_id:x.campus_id||'',level:x.level||6,status:x.status||'active'});
    setEditing(x.id);setShowForm(true);
  };
  var filtered=members.filter(function(m){
    if(!search)return true;
    var s=search.toLowerCase();
    return (m.first_name||'').toLowerCase().includes(s)||(m.last_name||'').toLowerCase().includes(s)||(m.email||'').toLowerCase().includes(s);
  });
  var INP=function(lbl,k,type){
    return React.createElement('div',{style:{marginBottom:'0.5rem'}},
      React.createElement('div',{style:{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--dmuted)',marginBottom:'0.1rem'}},lbl),
      React.createElement('input',{type:type||'text',value:form[k]||'',onChange:ff(k),style:{width:'100%',padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none',boxSizing:'border-box'}}));
  };
  var SEL=function(lbl,k,opts){
    return React.createElement('div',{style:{marginBottom:'0.5rem'}},
      React.createElement('div',{style:{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--dmuted)',marginBottom:'0.1rem'}},lbl),
      React.createElement('select',{value:form[k]||'',onChange:ff(k),style:{width:'100%',padding:'0.4rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.82rem',outline:'none',boxSizing:'border-box'}},
        opts.map(function(o){return React.createElement('option',{key:o[0],value:o[0]},o[1]);})));
  };
  return React.createElement('div',null,
    React.createElement('div',{className:'d-card-head'},
      React.createElement('span',{className:'d-card-title'},'Members — Live from Database'),
      React.createElement('div',{style:{display:'flex',gap:'0.5rem',alignItems:'center'}},
        React.createElement('input',{type:'text',placeholder:'Search members...',value:search,onChange:function(e){setSearch(e.target.value);},style:{padding:'0.35rem 0.65rem',borderRadius:6,border:'1px solid var(--bdr2)',background:'var(--bg3)',color:'var(--dtxt)',fontSize:'0.8rem',outline:'none'}}),
        React.createElement('button',{className:'btn-primary',onClick:toggleForm,style:{padding:'0.4rem 0.85rem',fontSize:'0.78rem',whiteSpace:'nowrap'}},showForm?'Cancel':'+ Add Member'))),
    loading?React.createElement('div',{style:{padding:'1rem',color:'var(--dmuted)'}},'Loading members from database...'):null,
    showForm?React.createElement('div',{className:'d-card',style:{marginBottom:'1rem'}},
      React.createElement('div',{style:{fontSize:'0.65rem',color:'var(--dmuted)',marginBottom:'0.5rem'}},editing?'EDIT MEMBER':'ADD MEMBER'),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}},
        INP('First Name','first_name'),INP('Last Name','last_name'),INP('Email','email','email'),INP('Phone','phone','tel'),
        SEL('Status','status',[['intake','Intake'],['active','Active'],['completed','Completed'],['inactive','Inactive']]),
        SEL('Level','level',[['6','6 - Member'],['5','5'],['4','4'],['3','3'],['2','2'],['1','1 - Staff'],['0','0 - Admin']])),
      React.createElement('button',{className:'btn-primary',onClick:save,style:{marginTop:'0.5rem'}},editing?'Save Changes':'Add Member')):null,
    !loading?React.createElement('div',null,
      React.createElement('div',{style:{fontSize:'0.72rem',color:'var(--dmuted)',marginBottom:'0.75rem'}},filtered.length+' members'),
      React.createElement('div',{style:{display:'grid',gap:'0.5rem'}},
        filtered.map(function(m){
          return React.createElement('div',{key:m.id,className:'d-card',style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 1rem'}},
            React.createElement('div',null,
              React.createElement('div',{style:{fontWeight:700,color:'var(--dtxt)',fontSize:'0.9rem'}},(m.first_name||'')+' '+(m.last_name||m.username||'')),
              React.createElement('div',{style:{fontSize:'0.75rem',color:'var(--dmuted)'}},(m.email||'')+(m.campus_name?' | '+m.campus_name:'')+(m.status?' | '+m.status:''))),
            React.createElement('div',{style:{display:'flex',gap:'0.35rem'}},
              React.createElement('button',{onClick:function(){startEdit(m);},style:{padding:'0.2rem 0.5rem',fontSize:'0.7rem',borderRadius:5,border:'1px solid var(--bdr2)',background:'var(--bg2)',color:'var(--dtxt)',cursor:'pointer'}},'Edit'),
              React.createElement('span',{style:{padding:'0.2rem 0.5rem',fontSize:'0.65rem',borderRadius:5,background:m.is_active?'rgba(91,196,110,0.15)':'rgba(239,68,68,0.1)',color:m.is_active?'var(--l5)':'#ef4444'}},m.is_active?'Active':'Inactive')));
        }))):null);
}

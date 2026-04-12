import re,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
fns=re.findall(r'function (\w+Panel|\w+Builder|\w+Engine|\w+Manager|\w+Overview|\w+Board)\(',c)
fns=list(dict.fromkeys(fns))
for f in fns:
    idx=c.find('function '+f)
    chunk=c[idx:idx+3000]
    nxt=chunk.find('\nfunction ',10)
    if nxt>0:chunk=chunk[:nxt]
    has_railway='POLR_API_BASE' in chunk or 'hope_token' in chunk
    sample='SAMPLE_' in chunk or 'DEMO DATA' in chunk
    platform_refs=list(set(re.findall(r'platform\.(\w+)',chunk)))[:5]
    print(f"{f}: {'RAILWAY' if has_railway else 'FAKE' if sample else 'LOCAL'} | refs:{platform_refs}")

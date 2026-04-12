import re,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
panels=[('MembersFullPanel','Members'),('HousingPanel','Housing'),('WorkforcePanel','Workforce'),('FinancialOverview','Financial'),('MeetingsPanel','Meetings'),('ProgramsBuilder','Programs'),('AnnouncementsBuilder','Announcements'),('GrantEngine','Grant Engine'),('ClientManager','Client Manager'),('BillingPanel','Billing'),('SchedulerPanel','Scheduler')]
for fn,label in panels:
    idx=c.find('function '+fn)
    if idx<0:
        print(f"\n=== {label} === NOT FOUND")
        continue
    chunk=c[idx:idx+6000]
    nxt=chunk.find('\nfunction ',10)
    if nxt>0:chunk=chunk[:nxt]
    has_railway='POLR_API_BASE' in chunk or 'hope_token' in chunk
    has_fetch='fetch(' in chunk
    platform_refs=list(set(re.findall(r'platform\.(\w+)',chunk)))[:6]
    fields=re.findall(r"INP\(['\"]([^'\"]+)['\"]",chunk)[:8]
    sample=('SAMPLE_' in chunk or 'DEMO' in chunk or 'demo' in chunk)
    print(f"\n=== {label} ({fn}) ===")
    print(f"  Wired to Railway: {'YES' if has_railway else 'NO - fake data' if sample else 'NO'}")
    print(f"  Platform refs: {platform_refs}")
    print(f"  Form fields: {fields}")

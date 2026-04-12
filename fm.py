import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('function MembersFullPanel')
chunk=c[idx:idx+8000]
for term in ['SAMPLE_MEMBERS,','platform.members ||','allMembers =','var allM']:
    i=chunk.find(term)
    if i>0:
        print(repr(chunk[i-10:i+120]))
        print()

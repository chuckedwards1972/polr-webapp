import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('test_campus.js',encoding='utf-8').read()
opens=0
maxopen=0
for i,ch in enumerate(c):
    if ch=='(':opens+=1
    elif ch==')':opens-=1
    if opens>maxopen:maxopen=opens
print('max depth:',maxopen)
print('final balance:',opens)
for i in range(len(c)-1,-1,-1):
    if c[i]==')':
        before=c[max(0,i-60):i+1]
        print('last ) at:',i,repr(before))
        break

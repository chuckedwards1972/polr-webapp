import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('test_campus.js',encoding='utf-8').read()
opens=0
for i,ch in enumerate(c):
    if ch=='(':opens+=1
    elif ch==')':
        opens-=1
        if opens<0:
            print('Extra ) at position:',i)
            print('Context:',repr(c[i-50:i+20]))
            break

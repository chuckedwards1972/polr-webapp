import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('_setToken')
print(repr(c[idx:idx+200]))

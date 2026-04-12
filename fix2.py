import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('test_campus.js',encoding='utf-8').read()
old='"Remove")));}))):null);}'
new='"Remove")));}))):null);}'
print('searching for:',repr(old))
print('found:',old in c)
c=c.replace('"Remove")));}))):null);}','"Remove")));}))):null);}')
c=c.replace('})));}))):null);}','})):null);}')
open('test_campus.js','w',encoding='utf-8').write(c)
r=subprocess.run(['node','--check','test_campus.js'],capture_output=True,text=True)
print('JS:',r.returncode)
if r.returncode!=0:
    print(r.stderr[-200:])
    print('Context around pos 5150:',repr(c[5130:5210]))

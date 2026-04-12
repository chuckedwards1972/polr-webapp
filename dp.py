import re,subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
new_fn=open('donations_panel.js',encoding='utf-8').read()
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('function DonationsPanel(')
chunk=c[idx:idx+100000]
import re as r2
nxt=r2.search(r'\nfunction \w+',chunk[10:])
end=idx+(nxt.start()+1 if nxt else len(chunk))
c=c[:idx]+new_fn+c[end:]
open('POLR-WIRED-ENHANCED.html','w',encoding='utf-8').write(c)
subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
subprocess.run(['git','commit','-m','Wire DonationsPanel to Railway'])
subprocess.run(['git','push'])
print('DONE.')

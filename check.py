import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('loadCampusesFromDB')
print('function at:',idx)
idx2=c.find("case 'campuses'")
print('campuses case at:',idx2)
print('case content:',repr(c[idx2:idx2+150]))

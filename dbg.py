import re
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
start=c.find('function CampusesBuilder(')
chunk=c[start:start+10000]
idx=chunk.find('\nfunction ')
print('next function at offset:',idx)
print('next function:',repr(chunk[idx:idx+60]))

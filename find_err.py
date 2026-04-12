import re
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
idx=c.find('function CampusesBuilder(')
end=c.find('function ',idx+100)
chunk=c[idx:end]
print(len(chunk))
print(repr(chunk[-200:]))

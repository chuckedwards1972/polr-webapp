import re,subprocess
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
start=c.find('function CampusesBuilder(')
end=c.find('function ',start+100)
print('start:',start,'end:',end)

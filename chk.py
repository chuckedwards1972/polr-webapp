import os
os.chdir(r'C:\POLR-WebApp-Deploy')
c=open('POLR-WIRED-ENHANCED.html',encoding='utf-8').read()
for fn in ['MeetingsBuilder','HousingBuilder','DonationsPanel','GrantEngine','EmployersBuilder']:
    idx=c.find('function '+fn+'(')
    print(fn+':',repr(c[idx:idx+80]))

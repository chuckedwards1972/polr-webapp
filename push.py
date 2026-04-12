import subprocess,os
os.chdir(r'C:\POLR-WebApp-Deploy')
subprocess.run(['git','stash'])
subprocess.run(['git','pull','--rebase'])
subprocess.run(['git','stash','pop'])
subprocess.run(['git','add','POLR-WIRED-ENHANCED.html'])
subprocess.run(['git','commit','-m','Wire Meetings Housing Grants Employers to Railway'])
subprocess.run(['git','push'])
print('DONE.')

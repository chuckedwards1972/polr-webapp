import re, subprocess
with open("POLR-WIRED-ENHANCED.html", encoding="utf-8") as f:
    c = f.read()
old = "background:\"var(--card)\",border:\"1px solid var(--bdr)\",borderRadius:16,padding:\"2rem\",maxWidth:620,margin:\"2rem auto 0\""
new = "background:\"var(--bg2)\",border:\"1px solid var(--bdr2)\",borderRadius:16,padding:\"2rem\",maxWidth:620,margin:\"2rem auto 0\""
if old in c:
    c = c.replace(old, new)
    print("Background fixed.")
else:
    print("NOT FOUND bg")
old2 = "fontSize:\"1.35rem\",marginBottom:\"0.5rem\",color:\"var(--text)\""
new2 = "fontSize:\"1.35rem\",marginBottom:\"0.5rem\",color:\"var(--gold)\""
if old2 in c:
    c = c.replace(old2, new2)
    print("Title color fixed.")
else:
    print("NOT FOUND title")
with open("POLR-WIRED-ENHANCED.html", "w", encoding="utf-8") as f:
    f.write(c)
scripts = re.findall(r"(?s)<script(?:\s+id=\"[^\"]*\")?\s*>(.*?)</script>", c)
with open("polr-check.js", "w", encoding="utf-8") as f:
    f.write("\n".join(scripts))
r = subprocess.run(["node","--check","polr-check.js"], capture_output=True, text=True)
if r.returncode == 0:
    print("SYNTAX OK - pushing")
    subprocess.run(["git","add","POLR-WIRED-ENHANCED.html"])
    subprocess.run(["git","commit","-m","Fix Get Started card style to match Launch section"])
    subprocess.run(["git","push"])
    print("DONE. Test in 60 seconds.")
else:
    print("ERROR:", r.stderr[-200:])

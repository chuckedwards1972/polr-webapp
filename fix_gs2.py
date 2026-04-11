import re, subprocess
with open("POLR-WIRED-ENHANCED.html", encoding="utf-8") as f:
    c = f.read()
old = "fontSize:\"0.9rem\",color:\"var(--text)\",marginBottom:\"1.5rem\",lineHeight:1.6}},\"Chuck Edwards personally reviews"
new = "fontSize:\"0.9rem\",color:\"rgba(255,255,255,0.85)\",marginBottom:\"1.5rem\",lineHeight:1.6}},\"Chuck Edwards personally reviews"
if old in c:
    c = c.replace(old, new)
    print("Fixed.")
else:
    print("NOT FOUND")
with open("POLR-WIRED-ENHANCED.html", "w", encoding="utf-8") as f:
    f.write(c)
scripts = re.findall(r"(?s)<script(?:\s+id=\"[^\"]*\")?\s*>(.*?)</script>", c)
with open("polr-check.js", "w", encoding="utf-8") as f:
    f.write("\n".join(scripts))
r = subprocess.run(["node","--check","polr-check.js"], capture_output=True, text=True)
if r.returncode == 0:
    print("SYNTAX OK - pushing")
    subprocess.run(["git","add","POLR-WIRED-ENHANCED.html"])
    subprocess.run(["git","commit","-m","Fix Get Started subtext to white"])
    subprocess.run(["git","push"])
    print("DONE.")
else:
    print("ERROR:", r.stderr[-200:])


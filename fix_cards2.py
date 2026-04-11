import re, subprocess
with open("POLR-WIRED-ENHANCED.html", encoding="utf-8") as f:
    c = f.read()
old = "fontSize:\"1rem\",marginBottom:\"0.5rem\",color:\"var(--text)\"}},p[0]),"
new = "fontSize:\"1rem\",marginBottom:\"0.5rem\",color:\"var(--gold)\"}},p[0]),"
if old in c:
    c = c.replace(old, new)
    print("Title color fixed to gold.")
else:
    print("NOT FOUND title")
old2 = "fontSize:\"0.85rem\",color:\"var(--text)\",lineHeight:1.6}},p[1]"
new2 = "fontSize:\"0.85rem\",color:\"rgba(255,255,255,0.8)\",lineHeight:1.6}},p[1]"
if old2 in c:
    c = c.replace(old2, new2)
    print("Body text color fixed to white.")
else:
    print("NOT FOUND body")
with open("POLR-WIRED-ENHANCED.html", "w", encoding="utf-8") as f:
    f.write(c)
scripts = re.findall(r"(?s)<script(?:\s+id=\"[^\"]*\")?\s*>(.*?)</script>", c)
with open("polr-check.js", "w", encoding="utf-8") as f:
    f.write("\n".join(scripts))
r = subprocess.run(["node","--check","polr-check.js"], capture_output=True, text=True)
if r.returncode == 0:
    print("SYNTAX OK - pushing")
    subprocess.run(["git","add","POLR-WIRED-ENHANCED.html"])
    subprocess.run(["git","commit","-m","Fix Launch cards text colors - gold title white body"])
    subprocess.run(["git","push"])
    print("DONE. Test in 60 seconds.")
else:
    print("ERROR:", r.stderr[-200:])

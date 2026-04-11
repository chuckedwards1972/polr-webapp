import re, subprocess
with open("POLR-WIRED-ENHANCED.html", encoding="utf-8") as f:
    c = f.read()
old = "window.POLR_API_BASE + '/lms/lesson-submission'"
new = "window.POLR_API_BASE + '/lms/lessons/' + toSave.id + '/submit'"
if old in c:
    c = c.replace(old, new)
    print("Fixed.")
else:
    print("NOT FOUND - searching...")
    idx = c.find("lms/lesson-submission")
    print("Found at:", idx)
with open("POLR-WIRED-ENHANCED.html", "w", encoding="utf-8") as f:
    f.write(c)
scripts = re.findall(r"(?s)<script(?:\s+id=\"[^\"]*\")?\s*>(.*?)</script>", c)
with open("polr-check.js", "w", encoding="utf-8") as f:
    f.write("\n".join(scripts))
r = subprocess.run(["node","--check","polr-check.js"], capture_output=True, text=True)
if r.returncode == 0:
    print("SYNTAX OK - pushing")
    subprocess.run(["git","add","POLR-WIRED-ENHANCED.html"])
    subprocess.run(["git","commit","-m","Fix LMS endpoint to match backend route"])
    subprocess.run(["git","push"])
    print("DONE.")
else:
    print("ERROR:", r.stderr[-200:])


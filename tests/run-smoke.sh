#!/usr/bin/env bash
# Offline smoke test: no Claude login, no network. Validates the plugin's shape.
#   - plugin.json / marketplace.json parse and agree
#   - every skill has frontmatter name + description, and the name matches its folder
#   - no broken relative links in Markdown files
#   - fixtures parse and are fictional-looking (fake phone pattern)
#   - the board template renders with fixture data and its script is valid JS (if node exists)
set -uo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
FIX="$REPO/tests/fixtures"
fail=0
check() { if eval "$2"; then echo "  PASS $1"; else echo "  FAIL $1"; fail=1; fi; }

echo "== manifests"
check "plugin.json parses"      'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$REPO/.claude-plugin/plugin.json"'
check "marketplace.json parses" 'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$REPO/.claude-plugin/marketplace.json"'
check "plugin name is depa"     'python3 -c "import json,sys; sys.exit(json.load(open(sys.argv[1]))[\"name\"]!=\"depa\")" "$REPO/.claude-plugin/plugin.json"'
check "marketplace lists depa"  'python3 -c "import json,sys; sys.exit(\"depa\" not in [p[\"name\"] for p in json.load(open(sys.argv[1]))[\"plugins\"]])" "$REPO/.claude-plugin/marketplace.json"'
check "versions match"          'python3 - "$REPO" <<PY
import json,sys
r=sys.argv[1]
a=json.load(open(r+"/.claude-plugin/plugin.json"))["version"]
b=json.load(open(r+"/.claude-plugin/marketplace.json"))["metadata"]["version"]
sys.exit(a!=b)
PY'

echo "== skills"
for f in "$REPO"/skills/*/SKILL.md; do
  d=$(basename "$(dirname "$f")")
  check "$d: frontmatter name matches folder" 'python3 - "$f" "$d" <<PY
import re,sys
t=open(sys.argv[1]).read()
m=re.match(r"---\n(.*?)\n---\n",t,re.S)
sys.exit(0 if m and re.search(r"^name: "+sys.argv[2]+r"$",m.group(1),re.M) else 1)
PY'
  check "$d: has description" 'python3 - "$f" <<PY
import re,sys
t=open(sys.argv[1]).read()
m=re.match(r"---\n(.*?)\n---\n",t,re.S)
sys.exit(0 if m and re.search(r"^description: \S.{20,}",m.group(1),re.M) else 1)
PY'
  check "$d: reads ground rules" 'grep -q "shared/ground-rules.md" "$f"'
done
check "all 7 skills present" '[[ $(ls -d "$REPO"/skills/*/ | wc -l) -eq 7 ]]'

echo "== links"
check "no broken relative links in .md files" 'python3 - "$REPO" <<PY
import os,re,sys
root=sys.argv[1]; bad=[]
for dp,dn,fn in os.walk(root):
    dn[:]=[d for d in dn if d not in (".git","out")]
    for f in fn:
        if not f.endswith(".md"): continue
        p=os.path.join(dp,f); t=open(p,encoding="utf-8").read()
        t=re.sub(r"\`\`\`.*?\`\`\`","",t,flags=re.S)
        for m in re.finditer(r"\]\(([^)\s]+)\)",t):
            u=m.group(1)
            if re.match(r"(https?:|mailto:|#)",u): continue
            u=u.split("#")[0]
            if u and not os.path.exists(os.path.normpath(os.path.join(dp,u))): bad.append((p,u))
for b in bad: print("   broken:",b)
sys.exit(1 if bad else 0)
PY'
check "referenced shared files exist" '[[ -f "$REPO/shared/ground-rules.md" && -f "$REPO/shared/chrome.md" ]]'

echo "== fixtures"
check "listings fixture parses"      'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$FIX/listings-sample.json"'
check "stages are valid"             'python3 - "$FIX/listings-sample.json" <<PY
import json,sys
ok={"suggested","to_review","contacted","visit_scheduled","visited","finalist","last_resort","discarded"}
sys.exit(0 if all(l["stage"] in ok for l in json.load(open(sys.argv[1]))["listings"]) else 1)
PY'
check "fixture phones are fake (55 0000 xxxx)" '! grep -hoE "\"contact_phone\": \"[^\"]*\"" "$FIX/listings-sample.json" | grep -qvE "55 0000 [0-9]{4}"'
check "criteria fixture has required keys" 'for k in city budget bedrooms_min pets furnished neighborhoods move_in visit_trip guarantee_options; do grep -q "^$k:" "$FIX/criteria-sample.yaml" || exit 1; done'

echo "== board template"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/depa-smoke.XXXXXX")"
python3 - "$REPO" "$TMP" <<'PY'
import json,sys
r,t=sys.argv[1:3]
tpl=open(r+"/skills/tablero/assets/board-template.html",encoding="utf-8").read()
data=json.load(open(r+"/tests/fixtures/listings-sample.json"))["listings"]
out=tpl.replace("/*__DEPA_DATA__*/[]",json.dumps(data).replace("</","<\\/")).replace("__DEPA_LANG__","en")
open(t+"/board.html","w",encoding="utf-8").write(out)
PY
check "template has data marker"   'grep -q "__DEPA_DATA__" "$REPO/skills/tablero/assets/board-template.html"'
check "rendered board has no leftover markers" '! grep -q "__DEPA_" "$TMP/board.html"'
check "rendered board contains fixture listing" 'grep -q "Blue Door" "$TMP/board.html"'
check "board uses no external scripts"  '! grep -qE "<script[^>]+src=" "$TMP/board.html"'
if command -v node >/dev/null 2>&1; then
  check "board script is valid JS" 'python3 -c "
import re,sys
h=open(sys.argv[1]).read()
open(sys.argv[2],\"w\").write(re.search(r\"<script>(.*)</script>\",h,re.S).group(1))" "$TMP/board.html" "$TMP/board.js" && node --check "$TMP/board.js"'
else echo "  SKIP board script syntax (node not installed)"; fi
rm -rf "$TMP"

echo
[[ $fail -eq 0 ]] && echo "ALL PASSED" || echo "FAILURES"
exit $fail

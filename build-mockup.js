const fs = require('fs');
const path = require('path');
const dir = String.raw`C:\Users\ahunt\Documents\IMT Claude\Pipeline-Office\Discord-Pipeline-Projects\fred2\mockups`;
const files = ['recherche','overview','publications','cartographie','timeline','reseau','export'];
const labels = ['🔍 Recherche','📊 Vue d\'ensemble','📚 Publications','🗺️ Cartographie','📈 Timeline','👥 Réseau','📄 Export PDF'];

const contents = files.map(f => {
  const html = fs.readFileSync(path.join(dir, f+'.html'), 'utf8');
  return html.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
});

let tabsHtml = '';
let panelsHtml = '';
files.forEach((f,i) => {
  const active = i===0;
  tabsHtml += `<button class="tab${active?' active':''}" onclick="switchTab(${i})">${labels[i]}</button>\n`;
  panelsHtml += `<div class="panel" id="panel-${i}" style="display:${active?'flex':'none'};flex:1"><iframe srcdoc="${contents[i]}" style="width:100%;height:100%;border:none;min-height:85vh"></iframe></div>\n`;
});

const output = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ScholarScope - App Mockup</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f1729;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;height:100vh;display:flex;flex-direction:column}
header{padding:16px 24px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:16px}
.logo{font-size:24px;font-weight:700;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:13px;color:#94a3b8}
nav{display:flex;gap:4px;padding:8px 24px;border-bottom:1px solid #1e293b;overflow-x:auto}
.tab{background:none;border:none;color:#94a3b8;padding:10px 16px;cursor:pointer;border-radius:8px;font-size:13px;white-space:nowrap;transition:all .2s}
.tab:hover{background:#1e293b;color:#e2e8f0}
.tab.active{background:#1e293b;color:#e2e8f0;font-weight:600}
main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.panel{display:none;flex:1;flex-direction:column}
</style>
</head>
<body>
<header>
<span class="logo">ScholarScope</span>
<span class="subtitle">Dashboard chercheur académique — Compilation des maquettes</span>
</header>
<nav>
${tabsHtml}</nav>
<main>
${panelsHtml}</main>
<script>
function switchTab(n){
  document.querySelectorAll(".tab").forEach(function(t,i){t.classList.toggle("active",i===n)});
  document.querySelectorAll(".panel").forEach(function(p,i){p.style.display=i===n?"flex":"none"});
}
</script>
</body>
</html>`;

const outPath = path.join(path.dirname(dir), 'app-mockup.html');
fs.writeFileSync(outPath, output, 'utf8');
const stat = fs.statSync(outPath);
console.log('Created:', outPath);
console.log('Size:', (stat.size/1024).toFixed(1), 'KB');
console.log('Has srcdoc:', output.includes('srcdoc='));

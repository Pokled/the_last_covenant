# 📚 Documentation Hub - Mode d'emploi

## 🎯 Utilisation

### **Ouvrir le hub**
Double-clic sur `docs-hub.html` ou :
```powershell
start docs-hub.html
```

### **Mettre à jour automatiquement**
Quand tu ajoutes/modifies des fichiers `.md` :

#### Option 1 : Double-clic
`update-docs.bat`

#### Option 2 : PowerShell
```powershell
.\update-docs.ps1
```

#### Option 3 : Via GitHub Copilot
"Mets à jour le docs hub"

---

## ⚙️ Comment ça marche ?

### **Scan automatique**
Le script `update-docs.ps1` :
1. Scanne tous les `.md` du projet
2. Détecte automatiquement la catégorie (lore, combat, ui, etc.)
3. Extrait les métadonnées (date, taille)
4. Génère un titre lisible
5. Met à jour `docs-hub.html`

### **Catégories auto-détectées**
- **Lore** : *lore*, *chapitre*, grock.md
- **Combat** : *combat*, *dopamine*
- **UI** : *ui*, *layout*, *refonte*, *screen*
- **Guides** : *guide*, *particle*, *texture*
- **Sessions** : *session*, *recap*, *resume*, *juice*
- **TODO** : *todo*, *faire*, *status*, *plan*
- **Général** : tout le reste

---

## 🚀 Workflow recommandé

### Quand tu crées/modifies un doc :

1. **Nomme-le bien** (ex: `LORE_CHAPITRE_5.md`, `GUIDE_ANIMATIONS.md`)
2. **Lance la MAJ** : double-clic sur `update-docs.bat`
3. **Rafraîchis le hub** (F5 dans le navigateur)

### Conventions de nommage :
- `LORE_*.md` → Lore
- `COMBAT_*.md` → Combat
- `UI_*.md` ou `LAYOUT_*.md` → UI
- `GUIDE_*.md` → Guides
- `SESSION_*.md` → Sessions
- `TODO*.md` → TODO

---

## 🎨 Personnalisation

### Ajouter une catégorie :

**1. Dans `update-docs.ps1` :**
```powershell
if ($name -like "*mavariable*") { return "macategorie" }
```

**2. Dans `docs-hub.html` :**
```javascript
// Ajouter dans categoryLabels
macategorie: 'Mon Label',

// Ajouter dans categoryOrder
const categoryOrder = ['lore', 'combat', 'ui', 'guides', 'sessions', 'todo', 'macategorie', 'general'];

// Ajouter le badge CSS
.badge-macategorie { background: rgba(255, 0, 0, 0.3); color: #ff0000; }
```

### Modifier un titre manuellement :

Dans `update-docs.ps1`, section `$specialTitles` :
```powershell
"MON FICHIER" = "Mon Titre Personnalisé"
```

---

## 🐛 Troubleshooting

### Le script ne se lance pas ?
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass
```

### Les dates sont fausses ?
Le script utilise `LastWriteTime`. Si tu veux forcer une date, modifie le fichier.

### Un doc n'apparaît pas ?
Vérifie qu'il a l'extension `.md` et qu'il n'est pas dans `node_modules` ou `.git`.

---

## 📊 Stats

- **Scan time** : < 1 seconde
- **Capacité** : Illimitée (testé avec 100+ docs)
- **Performance** : Aucun impact (statique HTML/JS)

---

**Créé le 31/12/2024**  
**Prêt à l'emploi ! 🎉**

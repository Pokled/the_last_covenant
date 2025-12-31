# 🌐 Hébergement Documentation — Options & Recommandations

## 🎯 Ton besoin
Partager le projet entier avec les LLMs (Claude, ChatGPT, DeepSeek) sans limite de taille.

---

## ✅ SOLUTION RECOMMANDÉE : GitHub Pages (GRATUIT)

### Pourquoi GitHub Pages ?
- ✅ **100% gratuit**
- ✅ **Pas d'ouverture de ports** (sécurisé)
- ✅ **HTTPS automatique**
- ✅ **CDN mondial** (rapide partout)
- ✅ **URL propre** : `https://tonpseudo.github.io/the-last-covenant/`
- ✅ **Pas de limite de taille** pour markdown
- ✅ **Mise à jour facile** (git push)
- ✅ **Compatible LLMs** (ils peuvent lire les URLs)

### Setup (5 minutes)

#### 1. Créer un repo GitHub
```powershell
cd G:\Jeux_Perso\1_THE_LAST_COVENANT
git init
git add docs-hub.html docs-hub-readme.md *.md doc/
git commit -m "Initial docs"
```

#### 2. Pusher sur GitHub
```powershell
# Créer repo sur github.com (interface web)
# Puis :
git remote add origin https://github.com/TON_PSEUDO/the-last-covenant.git
git branch -M main
git push -u origin main
```

#### 3. Activer GitHub Pages
- Va sur ton repo GitHub
- Settings → Pages
- Source : "Deploy from a branch"
- Branch : `main` / `root`
- Save

**✨ En 5 min, ton site est en ligne : `https://tonpseudo.github.io/the-last-covenant/docs-hub.html`**

---

## ❌ OPTIONS À ÉVITER

### Ouvrir le port 80 chez toi
- ❌ **Risque sécurité** (ton IP publique exposée)
- ❌ **IP dynamique** (change régulièrement)
- ❌ **Nécessite router config** (port forwarding)
- ❌ **Pas de HTTPS** (LLMs peuvent refuser)
- ❌ **Bande passante limitée**
- ❌ **PC doit rester allumé 24/7**

### Hébergement payant classique
- ❌ **Coûte de l'argent** (5-10€/mois)
- ❌ **Overkill** pour de la doc statique
- ❌ **Setup plus complexe** (FTP, cPanel, etc.)

---

## 🎯 ALTERNATIVES GRATUITES

### 1. **Netlify** (Excellent aussi)
- Gratuit
- Drag & drop (upload dossier)
- HTTPS automatique
- URL type : `https://the-last-covenant.netlify.app`
- **Setup : 2 minutes**

**Comment faire :**
1. Va sur [netlify.com](https://www.netlify.com)
2. Drag & drop ton dossier projet
3. C'est en ligne !

---

### 2. **Vercel** (Pour devs)
- Gratuit
- Intégration Git
- HTTPS automatique
- URL type : `https://the-last-covenant.vercel.app`
- **Setup : 3 minutes**

**Comment faire :**
1. Va sur [vercel.com](https://vercel.com)
2. Import ton repo GitHub
3. Deploy automatique

---

### 3. **GitLab Pages** (Alternative GitHub)
- Gratuit
- Comme GitHub Pages
- URL type : `https://tonpseudo.gitlab.io/the-last-covenant/`

---

## 🔥 MA RECOMMANDATION : NETLIFY (Le plus simple)

### Étapes concrètes :

#### 1. Prépare ton dossier
```powershell
# Crée un dossier propre
New-Item -ItemType Directory -Path "G:\Jeux_Perso\1_THE_LAST_COVENANT\deploy"

# Copie les fichiers nécessaires
Copy-Item docs-hub.html deploy/index.html
Copy-Item -Recurse doc deploy/
Copy-Item *.md deploy/
```

#### 2. Va sur Netlify
- [https://www.netlify.com/](https://www.netlify.com/)
- "Sign up" (gratuit, avec GitHub ou email)

#### 3. Deploy
- Clique "Add new site" → "Deploy manually"
- Drag & drop le dossier `deploy/`
- **C'est en ligne en 30 secondes !**

#### 4. Configure
- Change le nom du site : `Settings` → `Site details` → `Change site name`
- Exemple : `the-last-covenant`
- URL finale : `https://the-last-covenant.netlify.app`

---

## 🤖 USAGE AVEC LLMs

### Une fois en ligne :

**Claude, ChatGPT, DeepSeek :**
```
Voici mon projet : https://the-last-covenant.netlify.app

Peux-tu lire les docs ?
```

**Avantages :**
- ✅ Ils peuvent lire TOUTE la doc (pas de limite taille)
- ✅ Navigation naturelle (clics sur liens)
- ✅ Tu updates le site → ils voient la MAJ
- ✅ Pas de ZIP à uploader

---

## 🔄 WORKFLOW RECOMMANDÉ

### Setup initial (5 min) :
1. Netlify → Deploy manuel
2. Récupère l'URL : `https://ton-site.netlify.app`

### Updates quotidiennes :
#### Option 1 : Drag & drop (facile)
1. Lance `.\update-docs.ps1`
2. Copie `docs-hub.html` + `doc/` + `*.md` dans `deploy/`
3. Drag & drop sur Netlify → redéploie automatiquement

#### Option 2 : Git auto (avancé)
1. Connecte Netlify à ton repo GitHub
2. `git push` → déploiement automatique

---

## 📊 COMPARATIF

| Solution | Gratuit | Temps setup | Sécurité | LLM-friendly | MAJ facile |
|----------|---------|-------------|----------|--------------|------------|
| **Netlify** | ✅ | 2 min | ✅ | ✅ | ✅ |
| GitHub Pages | ✅ | 5 min | ✅ | ✅ | ⚠️ (git) |
| Port 80 chez toi | ✅ | 30 min | ❌ | ⚠️ | ❌ |
| Hébergement payant | ❌ | 1h | ✅ | ✅ | ⚠️ |

---

## 🎯 ACTION IMMÉDIATE

**Pour tester en 2 minutes :**

1. Va sur [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop ton dossier projet
3. Récupère l'URL
4. Partage l'URL aux LLMs

**Test direct sans inscription !**

---

## ⚡ SCRIPT AUTO-DEPLOY (Bonus)

Si tu choisis Netlify + Git :

```powershell
# deploy.ps1
Write-Host "🚀 Déploiement documentation..." -ForegroundColor Cyan

# MAJ docs
.\update-docs.ps1

# Git commit & push
git add .
git commit -m "Update docs $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push

Write-Host "✅ Déployé ! URL : https://ton-site.netlify.app" -ForegroundColor Green
```

Un seul double-clic → tout est en ligne ! 🎉

---

## 💡 POURQUOI PAS LOCALHOST ?

**Localhost ≠ accessible par LLMs**

Les LLMs ne peuvent **pas** accéder à :
- `http://localhost:80`
- `http://192.168.x.x` (IP locale)
- Ton PC derrière un NAT

Ils peuvent seulement accéder à des URLs publiques :
- ✅ `https://ton-site.netlify.app`
- ✅ `https://github.com/...`
- ✅ Tout domaine public

---

## 🎯 CONCLUSION

**Meilleure solution : Netlify**

**Pourquoi :**
- Gratuit
- 2 minutes de setup
- Drag & drop simple
- HTTPS automatique
- LLMs peuvent lire
- Pas de risque sécurité
- Pas besoin de Git (optionnel)

**Action :** Va sur [netlify.com/drop](https://app.netlify.com/drop) et teste maintenant ! 🚀

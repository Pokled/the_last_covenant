# 🔄 Documentation Hub - Auto-Update Script
# Scanne les fichiers .md et met à jour docs-hub.html automatiquement

Write-Host "🔄 Mise à jour du Documentation Hub..." -ForegroundColor Cyan

# Chemin du projet
$projectPath = "G:\Jeux_Perso\1_THE_LAST_COVENANT"
Set-Location $projectPath

# Fonction pour déterminer la catégorie
function Get-DocCategory {
    param($fileName, $fullPath)
    
    $name = $fileName.ToLower()
    
    # Images
    if ($fileName -match '\.(jpg|jpeg|png|gif|webp|svg)$') { return "images" }
    
    # Lore
    if ($name -like "*lore*" -or $name -like "*chapitre*" -or $name -eq "grock.md") { return "lore" }
    
    # Combat
    if ($name -like "*combat*" -or $name -like "*dopamine*") { return "combat" }
    
    # UI
    if ($name -like "*ui*" -or $name -like "*layout*" -or $name -like "*refonte*" -or $name -like "*screen*") { return "ui" }
    
    # Guides
    if ($name -like "*guide*" -or $name -like "*particle*" -or $name -like "*texture*" -or $name -like "*generation*") { return "guides" }
    
    # Sessions
    if ($name -like "*session*" -or $name -like "*recap*" -or $name -like "*resume*" -or $name -like "*juice*") { return "sessions" }
    
    # TODO
    if ($name -like "*todo*" -or $name -like "*faire*" -or $name -like "*status*" -or $name -like "*integration*" -or $name -like "*plan*") { return "todo" }
    
    return "general"
}

# Fonction pour formater le titre
function Get-FriendlyTitle {
    param($fileName)
    
    $title = $fileName -replace "\.md$", ""
    $title = $title -replace "_", " "
    $title = $title -replace "-", " "
    $title = $title -replace "@", ""
    
    # Cas spéciaux
    $specialTitles = @{
        "LORE UNIVERSE" = "Univers & Lore Complet"
        "LORE CHAPITRE 4 DESCENTE" = "Chapitre 4 : La Descente"
        "Grock" = "Transcript Grock (brut)"
        "TODO" = "TODO Principal"
        "README" = "README Principal"
        "FAIRE LES POPOS STACK" = "Stack Popos à faire"
        "COMBAT SYSTEM BG3 REDESIGN" = "Refonte Combat Style BG3"
        "COMBAT SYSTEM AAA ENHANCEMENT" = "Améliorations Combat AAA"
        "GUIDE TEXTURE GENERATION AAA" = "Guide Génération Textures AAA"
        "corruption particles aaa" = "Particules Corruption AAA"
    }
    
    $titleUpper = $title.ToUpper()
    foreach ($key in $specialTitles.Keys) {
        if ($titleUpper -eq $key) {
            return $specialTitles[$key]
        }
    }
    
    # Capitalisation simple
    return (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
}

# Scanner les fichiers .md ET images
Write-Host "📂 Scan des fichiers markdown et images..." -ForegroundColor Yellow

$mdFiles = Get-ChildItem -Path $projectPath -Filter "*.md" -Recurse | 
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*\.git*" }

$imageFiles = Get-ChildItem -Path $projectPath -Include "*.jpg","*.jpeg","*.png","*.gif","*.webp" -Recurse |
    Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*\.git*" }

$allFiles = $mdFiles + $imageFiles
$docs = @()

foreach ($file in $allFiles) {
    $relativePath = $file.FullName -replace [regex]::Escape($projectPath), "."
    $relativePath = $relativePath -replace "\\", "/"
    
    $doc = [PSCustomObject]@{
        name = $file.Name
        title = Get-FriendlyTitle -fileName $file.Name
        category = Get-DocCategory -fileName $file.Name -fullPath $file.FullName
        date = $file.LastWriteTime.ToString("dd/MM/yyyy")
        size = "{0:N1} KB" -f ($file.Length / 1KB)
        path = $relativePath
    }
    
    $docs += $doc
}

Write-Host "✅ Trouvé $($docs.Count) documents" -ForegroundColor Green

# Générer le JSON pour JavaScript
$docsJson = $docs | Sort-Object @{Expression={$_.LastWriteTime}; Descending=$true} | ConvertTo-Json -Compress

# Lire le fichier HTML actuel
$htmlPath = Join-Path $projectPath "docs-hub.html"
$htmlContent = Get-Content $htmlPath -Raw

# Remplacer la section docs
$pattern = "(?s)(const docs = \[).*?(\];)"
$replacement = "const docs = $docsJson;"

$updatedHtml = $htmlContent -replace $pattern, $replacement

# Sauvegarder
Set-Content -Path $htmlPath -Value $updatedHtml -Encoding UTF8

Write-Host "✨ Documentation Hub mis à jour avec succès !" -ForegroundColor Green
Write-Host "📊 Total: $($docs.Count) documents" -ForegroundColor Cyan
Write-Host "📅 Dernière MAJ: $(Get-Date -Format 'dd/MM/yyyy HH:mm')" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Ouvre docs-hub.html pour voir les changements" -ForegroundColor Yellow

import requests
import json
import base64
from pathlib import Path

# Configuration
url = 'http://127.0.0.1:7860/sdapi/v1/txt2img'

payload = {
    'prompt': 'Dark fantasy camp at night, 7 characters standing in a horizontal line facing camera, darkest dungeon art style, gritty medieval atmosphere, large campfire glow behind them in center, thick fog and mist, corrupted fantasy setting, shadowy tents in background, cinematic wide composition, dramatic rim lighting from campfire, grimdark aesthetic, detailed character silhouettes, moody colors, ominous atmosphere, stone ground, dead trees, masterpiece, best quality, highly detailed',
    'negative_prompt': 'bright, cheerful, colorful, anime, cartoon, low quality, blurry, text, watermark, signature, modern, UI elements, buttons',
    'steps': 30,
    'cfg_scale': 7.5,
    'width': 1920,
    'height': 1080,
    'sampler_name': 'DPM++ 2M Karras',
    'seed': -1
}

print('🎨 Génération de l\'image du Cortège des Ombres...')
print(f'📐 Résolution: 1920x1080')
print('⏳ Patience, cela peut prendre 1-2 minutes...')

try:
    response = requests.post(url, json=payload, timeout=300)
    response.raise_for_status()
    
    r = response.json()
    
    if 'images' in r and len(r['images']) > 0:
        image_data = r['images'][0]
        image_bytes = base64.b64decode(image_data)
        
        output_path = Path('assets/images/background/camp_cortege.png')
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(image_bytes)
        
        print(f'✅ Image générée: {output_path}')
        print(f'📦 Taille: {len(image_bytes) / 1024:.1f} KB')
    else:
        print('❌ Erreur: Aucune image retournée')
        print(json.dumps(r, indent=2))
        
except requests.exceptions.ConnectionError:
    print('❌ Impossible de se connecter à Stable Diffusion')
    print('💡 Assure-toi que SD WebUI est lancé sur http://127.0.0.1:7860')
except Exception as e:
    print(f'❌ Erreur: {e}')

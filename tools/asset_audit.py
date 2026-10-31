#!/usr/bin/env python3
"""Check supported original asset extensions and empty files."""
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
folders=[root/"assets"/name for name in ("models","textures","audio")]
allowed={".glb",".gltf",".fbx",".obj",".png",".jpg",".jpeg",".webp",".ogg",".wav",".mp3"}
errors=[]
for folder in folders:
    if not folder.exists():
        print("[INFO] not created:",folder.relative_to(root)); continue
    for item in folder.rglob("*"):
        if item.is_file() and item.suffix.lower() not in allowed: errors.append("unsupported: "+str(item.relative_to(root)))
        if item.is_file() and item.stat().st_size==0: errors.append("empty: "+str(item.relative_to(root)))
for error in errors: print("[ERROR]",error)
if errors: sys.exit(1)
print("[OK] asset audit complete")
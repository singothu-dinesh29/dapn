import shutil
import os

src1 = r"C:\Users\singo\.gemini\antigravity\brain\3cfb3927-2945-499d-af92-488b60429b0d\media__1776713878567.jpg"
src2 = r"C:\Users\singo\.gemini\antigravity\brain\3cfb3927-2945-499d-af92-488b60429b0d\media__1776713886396.jpg"

dest_dir = r"c:\Users\singo\OneDrive\Documents\scratchweb\dapn\client\src\assets\founders"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

shutil.copy(src1, os.path.join(dest_dir, "dinesh.jpg"))
shutil.copy(src2, os.path.join(dest_dir, "pempal.jpg"))
print("Done")

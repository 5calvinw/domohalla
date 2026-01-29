import cv2
import numpy as np
from mss import mss
import time
import os



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "templates", "ranked_end_anchor.png")

template = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)
if template is None:
    raise RuntimeError(f"Template image not found at {template_path}")

t_h, t_w = template.shape


sct = mss()


THRESHOLD = 0.85

print("oon")


cv2.waitKey(0)
cv2.destroyAllWindows()

while True:
 
    screenshot = sct.grab(sct.monitors[2])
    frame = np.array(screenshot)

 
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

 
    result = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

    if max_val >= THRESHOLD:
        print("Event: GAME_ENDED", flush=True)
        time.sleep(30)  



    time.sleep(0.5)

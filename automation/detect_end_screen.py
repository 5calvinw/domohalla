import cv2
import numpy as np
from mss import mss
import time
import os
import pytesseract
import re
import json
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "templates", "ranked_end_anchor.png")




template = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)
if template is None:
    raise RuntimeError(f"Template image not found at {template_path}")

t_h, t_w = template.shape


sct = mss()


THRESHOLD = 0.75

print("oon")


cv2.waitKey(0)
cv2.destroyAllWindows()


already_triggered = False


while True:
 
    screenshot = sct.grab(sct.monitors[2])
    frame = np.array(screenshot)

 
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

 
    result = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    anchor_x, anchor_y = max_loc

 



 
    
    if max_val >= THRESHOLD and not already_triggered:
        already_triggered = True
        anchor_x, anchor_y = max_loc

        elo_roi = frame[
            anchor_y + 70 : anchor_y + 110,
            anchor_x + 250 : anchor_x + 500
        ]

        
        
        gray_elo = cv2.cvtColor(elo_roi, cv2.COLOR_BGR2GRAY)
        gray_elo = cv2.resize(gray_elo, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        _, thresh_elo = cv2.threshold(gray_elo, 150, 255, cv2.THRESH_BINARY)

        
        config = "--psm 7 -c tessedit_char_whitelist=0123456789"
        text = pytesseract.image_to_string(thresh_elo, config=config)

       
        digits = re.findall(r"\d+", text)

        if digits:
            combined = digits[0]

            if len(combined) == 8:   
                old_elo = int(combined[:4])
                new_elo = int(combined[4:])

                elo_change = new_elo - old_elo
                result = "WIN" if elo_change > 0 else "LOSS"

                print(json.dumps({
                    "event": "GAME_ENDED",
                    "result": result,
                    "elo_change": elo_change
                }), flush=True)
            else:
                print("Unexpected OCR length:", combined, flush=True)
        else:
            print("Elo OCR failed:", text, flush=True)

        time.sleep(10)
    elif max_val < THRESHOLD:
        already_triggered = False



    time.sleep(0.5)

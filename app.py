from flask import Flask, render_template, request, jsonify
import pygame
import numpy as np
import threading

app = Flask(__name__, template_folder="templates", static_folder="static")

# Initialize Pygame
pygame.init()

# Constants
SAMPLE_RATE = 44100
DURATION = 0.2
amp = 16000
dfbpm = 120
bpm = 120  # Default BPM
running = False
metronome_thread = None
dfloop = "bar(4,4)"
loop = "bar(4,4)"
dfbpm_step = 4
bpm_step = 4
volume = 1.0
def parse_set(set):
    pass

def parse_loop(loopp):
    loopp = loopp.strip()
    bars = loopp.split("\n")
    
    for barr in bars:
        barr=barr.strip()
        if barr.startswith("bar("):
            barr = barr[4:-1]
            barr=barr.strip()
            barr = barr.split(",")
            try:
                bar(int(barr[0]), int(barr[1]))
            except:
                return jsonify({"success": False, "error": "wrong arguments for bar() function"})
        else:
            return jsonify({"success": False, "error": "unknown loop command"})

def generate_sound(type, frequency, amp,vol, duration=DURATION, sample_rate=SAMPLE_RATE):
    num_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, num_samples, endpoint=False)
    global volume
    vol = vol * volume
    min_dB = -40  # Silence threshold (adjust as needed)
    log_volume = 10 ** ((vol * (0 - min_dB) + min_dB) / 20)  # C
    scaled_amp = amp * log_volume
    samples = (
        scaled_amp * np.sin(2 * np.pi * frequency * t)
        if type == 0 else scaled_amp * np.sign(np.sin(2 * np.pi * frequency * t))
    )
    fade_out = np.linspace(1, 0, num_samples)
    samples *= fade_out
    samples = np.clip(samples, -amp, amp).astype(np.int16)

    return np.stack((samples, samples), axis=-1)

def play_sound(type, frequency, amp):
    sound_data = generate_sound(type, frequency, amp)
    sound_array = pygame.sndarray.make_sound(sound_data)
    sound_array.play()

def bar(n1, n2):
    global running, bpm
    delay = int((60000 / bpm) * 4)
    i = 1 / n2
    while running and i <= n1 / n2:
        play_sound(0, 550 if i == 1 / n2 else 400, 16000)
        pygame.time.delay(int(int((60000 / bpm) * 4) / n2))
        i += 1 / n2

def metronome_loop():
    global running
    global loop
    while running:
        parse_loop(loop)

@app.route("/")
def index():
    return render_template("index.html", bpm=bpm, bpm_step=bpm_step)  # Pass bpm_step to template


@app.route("/toggle", methods=["POST"])
def toggle_metronome():
    global running, metronome_thread
    running = not running
    if running:
        metronome_thread = threading.Thread(target=metronome_loop)
        metronome_thread.start()
    return jsonify({"status": "running" if running else "stopped"})

@app.route("/update_loop", methods=["POST"])
def update_loop():
    global bpm
    try:
        print(request.json.get("bpm"))
        set = request.json.get("bpm")
        global loop
        loop = set
        return jsonify({"success": True, "bpm": bpm})
    except ValueError:
        return jsonify({"success": False, "error": "Invalid BPM value"})

@app.route("/update_bpm", methods=["POST"])
def update_bpm():
    global bpm
    try:
        bpm = int(request.json.get("bpm"))
        return jsonify({"success": True, "bpm": bpm})
    except ValueError:
        return jsonify({"success": False, "error": "Invalid BPM value"})

@app.route("/status")
def server_status():
    return jsonify({"running": running})

@app.route("/refreshed", methods=["POST"])
def refreshed():
    print("Page was refreshed!")
    global running
    global loop
    global bpm
    global bpm_step
    global dfloop
    global dfbpm
    global dfbpm_step
    if running == True:
        toggle_metronome()
        #return jsonify({"success": True})
    loop = dfloop
    bpm = dfbpm
    bpm_step = dfbpm_step
    return "OK", 200

@app.route("/increase_bpm", methods=["POST"])
def increase_bpm():
    global bpm, bpm_step
    try:
        bpm += bpm_step
        if bpm > 600:
            bpm -= bpm_step  # Prevent exceeding limit
        return jsonify({"success": True, "bpm": bpm})
    except ValueError:
        return jsonify({"success": False, "error": "Invalid BPM value"})


@app.route("/decrease_bpm", methods=["POST"])
def decrease_bpm():
    global bpm, bpm_step
    try:
        bpm -= bpm_step
        if bpm < 1:
            bpm += bpm_step  # Prevent BPM going below 1
        return jsonify({"success": True, "bpm": bpm})
    except ValueError:
        return jsonify({"success": False, "error": "Invalid BPM value"})
@app.route("/update_volume", methods=["POST"])
def update_volume():
    global volume
    try:
        volume = float(request.json.get("volume"))
        print(volume)
        #volume = max(0.0, min(volume, 1.0))  # Clamp between 0.0 (mute) and 1.0 (max)
        return jsonify({"success": True, "volume": volume})
    except ValueError:
        return jsonify({"success": False, "error": "Invalid volume value"})
#@app.route("/reset", methods=["POST"])
#def reset_bpm():
#    global bpm
#    bpm = 200  # Reset to default BPM
#    return jsonify({"success": True, "bpm": bpm})

if __name__ == "__main__":
    app.run(debug=True)

```
git clone https://github.com/MarianJandl/metronome_app
```
You need Python and flask, numpy, pygame libraries installed to run this metronome app
```
pip install flask numpy pygame
```
To start the app simply run the app.py file and then put the server address into your browser (usually http://127.0.0.1:5000)

App is still in development that's why the Flask uses development server

How to use this metronome app:
  - Play/Stop button - plays or stops the metronome
  - volume slider - you can adjust volume by using the slider
  - bpm slider and input box - you can change the tempo by using the slider or writing the new tempo to the input box
  - textarea - this is used to program custom track of bars with different time signitures:
      - bar() function has two parameters that define the time signiture, for example bar(4,4) means 4/4 bar
      - after you finish programming your bar track, click the Apply button to use your bar track\
      For example:
```
bar(9,4)
bar(7,8)
bar(4,4)
```

This app is open source, so you can change for example the pitch of the sounds by editing the app.py file.
(user interface for this and many more is still in development)

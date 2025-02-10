you need flask, numpy, pygame and threading libraries installed to run this metronome app

to start the app simply run the app.py file and then put the server address into your browser (usually http://127.0.0.1:5000)

app is still in development that's why the Flask uses development server

how to use this metronome app:
  > Play/Stop button - plays or stops the metronome
  > bpm slider and input box - you can change the tempo by using the slider or writing the new tempo to the input box
  > textarea - this is used to program custom track of bars with different time signitures:
      - bar() function has two parameters that define the time signiture, for example bar(4,4) means 4/4 bar
      - after you finish programming your bar track, click the Apply button to play your bar track

this app is open source, so you can change for example the pitch of the sounds by editing the app.py file.
(user interface for this and many more is still in development)

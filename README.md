# fyp-lofi-ai

## Overview
This projects purpose is to train an AI model to generate Lo-Fi music chords. With that data it will display the chords on a website to show the user of the service how to play the chords the AI has generated.

## Requirements
This was run on a WSL on a Windows machine.

Running the command below will install wsl onto a Windows machine. Ubuntu is installed by default.

```cmd
wsl --install
```

Anaconda or venv can be used to install the packages required.

Required:
- Python 3.10
- Node @latest 

Once you create a conda environment or venv install requiremnts.txt:
```cmd
pip install -r requirements.txt
````
---
### AI Model

To train the model:
```cmd
python lstm.py
```

To make a prediction: 
```
python predict.py
```
---
### React 

Intalling React project:
```cmd 
cd react
npm install
```

Run React server:
```cmd
npm run dev
```

Build React project:
```cmd
npm run build
```

---
### Running the Flask server:
```
python app.py
```
This command runs the whole project on localhost:5000
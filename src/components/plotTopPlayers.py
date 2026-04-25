import json, io, base64
import matplotlib
matplotlib.use('agg') 
import matplotlib.pyplot as plt
from js import document, window

data = json.loads(window.__pyodideDataTop)

names = [d['playerName'] for d in data]
duration = [d['duration'] for d in data]

fig, ax = plt.subplots(figsize=(10, 6))
ax.bar(names, duration, color='green', edgecolor='blue')
ax.set_title('Player Durations')
ax.set_ylabel('Durations')

buf = io.BytesIO()
fig.savefig(buf, format='png')
buf.seek(0)
img_b64 = base64.b64encode(buf.read()).decode('utf-8')
plt.close(fig)

target = document.getElementById('pyodide-target-durations')
target.innerHTML = f'<img src="data:image/png;base64,{img_b64}" alt="Chart" />'
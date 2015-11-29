from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route('/')
def hello_world():
    return send_from_directory('public/views', 'index.html')

@app.route('scripts/<path:path>')
def send_js(path):
    return send_from_directory('public/scripts', path)

@app.route('datasets/<path:path>')
def send_csv(path):
	return send_from_directory('public/datasets',path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
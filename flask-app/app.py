from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('public/views', 'index.html')

@app.route('/about')
def about():
    return send_from_directory('public/views', 'about.html')

@app.route('/context')
def context():
    return send_from_directory('public/views', 'context.html')

@app.route('/aboutdata')
def aboutdata():
    return send_from_directory('public/views', 'aboutdata.html')

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
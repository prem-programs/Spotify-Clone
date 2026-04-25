from flask import Flask, render_template, url_for, jsonify
import os


app = Flask(__name__)


@app.route('/')
def main():
    return render_template('index.html')

@app.route('/login')
def login_page():


    return render_template('login.html',form=form)
@app.route('/signup')
def signup():


    return render_template('signup')


@app.route('/songs')
def list_songs():
    songs_dir = os.path.join(app.root_path, 'static', 'songs')
    try:
        files = [f for f in os.listdir(songs_dir) if f.lower().endswith('.mp3')]
    except Exception:
        files = []
    return jsonify(files)




if __name__ == "__main__":
    app.run(debug=True)
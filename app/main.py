from flask import Flask, render_template, url_for, jsonify
from form import SignupForm
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = '229554709483d58b9a692ad6'

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/login')
def login_page():

    return render_template('login.html')

@app.route('/signup',methods= ['GET','POST'])
def signup():
    form = SignupForm()

    return render_template('signup.html',form=form)


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
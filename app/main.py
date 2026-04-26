from flask import Flask, render_template, url_for, jsonify,redirect,request,flash
from form import SignupForm,LoginForm
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] =os.getenv("SECRET_KEY")

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/login')
def login_page():

    return render_template('login.html')

@app.route('/signup',methods= ['GET','POST'])
def signup():
    form = SignupForm()

    username = form.username.data
    email = form.email.data
    password = form.password.data
    confirm = form.cPassword.data
    

    user_data = {
        "username": form.username.data,
        "email": form.email.data,
        "password": form.password.data   
    }

    file_path = os.path.join(app.root_path, 'info.json') # root path + info.json 

    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            try:
                data = json.load(f) #jo bhi malwa hai load karlo
            except:
                data = []
    else:
            data = []


    data.append(user_data) # user se malwa lo

    with open("info.json","w")as f:
        json.dump(data, f, indent=4)
        

    return render_template('signup.html',form=form)

@app.route('/login' , methods=['GET','POST'])
def login():
    form = LoginForm()
    


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
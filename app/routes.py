from flask import render_template, url_for, jsonify, redirect, request, flash
import os
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
from flask_login import login_user, logout_user, login_required
from app import app
from app.extensions import db
from app.models import User
from app.form import SignupForm, LoginForm

load_dotenv()



@app.route('/')
def main():
    return render_template('index.html')

@app.route('/signup',methods= ['GET','POST'])
def signup():
    form = SignupForm()

    if form.validate_on_submit():
        user_to_create = User(username=form.username.data,
                                email = form.email.data,
                               )
        user_to_create.Hpassword = form.password.data
                
        try:
            db.session.add(user_to_create)
            db.session.commit()
            return redirect(url_for('main'))
        except IntegrityError:
            db.session.rollback()
            return "user already exists"
    
    if (form.errors != {}):
        for err_msg in form.errors.values():
            flash(f'There is an error {err_msg} ',category='danger')

    return render_template('signup.html',form=form)

@app.route('/login' , methods=['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        attempted_user = User.query.filter_by(username = form.username.data).first()
        if attempted_user and attempted_user.check_password(form.password.data):
            login_user(attempted_user)
            flash("Login successful",category="success")
            return redirect(url_for('main'))

        else:
            flash("Username and password didn't match, try again", category='danger')
            
    return render_template("login.html",form = form)
    



@app.route('/songs')
def list_songs():
    songs_dir = os.path.join(app.root_path, 'static', 'songs')
    try:
        files = [f for f in os.listdir(songs_dir) if f.lower().endswith('.mp3')]
    except Exception:
        files = []
    return jsonify(files)


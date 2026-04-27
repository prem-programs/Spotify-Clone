from flask import Flask, render_template, url_for, jsonify,redirect,request,flash
from form import SignupForm,LoginForm
import os
import json
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy.exc import IntegrityError
from flask_login import LoginManager, login_user
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SECRET_KEY'] =os.getenv("SECRET_KEY")
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

#model
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model,UserMixin):
    id = db.Column(db.Integer(),primary_key=True)
    username = db.Column(db.String(length = 30) , nullable = False,unique = True)
    email = db.Column(db.String (length = 30),nullable = False)
    password= db.Column(db.String(length = 60),nullable = False )
    
    def __repr__(self):
        return f'{self.username}-{self.email}'
    
    @property
    def Hpassword(self):
        raise AttributeError("Password is not readable")
    
    @Hpassword.setter
    def Hpassword(self,plain_txt_password):
        self.password = bcrypt.generate_password_hash(plain_txt_password).decode('utf-8')
    
    def check_password(self , attempted_password):
        return bcrypt.check_password_hash(self.password,attempted_password)



#routes

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




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
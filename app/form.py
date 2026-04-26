from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField
#form for signup 

class SignupForm(FlaskForm):
    username = StringField(label="username")
    email = StringField(label="email_address")
    password = PasswordField(label="password")
    cPassword = PasswordField(label="confirm password")
    submit = SubmitField(label="Create Account")
    
class LoginForm(FlaskForm):
    email = StringField(label="email")
    password = PasswordField(label="password")
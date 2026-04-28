from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Length, EqualTo, DataRequired, Email, ValidationError
from app.models import User

#form for signup 

class SignupForm(FlaskForm):
     #def validate_Function name() so it will check the exact name 
    def validate_username(self, username_to_check):
        user = User.query.filter_by(username=username_to_check.data).first()
        if user:
            raise ValidationError('Username already exists! , please re try by another one ')


    #def validate_Function name() so it will check the exact email
    def validate_email(self, email_address_to_check):
        email = User.query.filter_by(email=email_address_to_check.data).first()
        if email:
            raise ValidationError('Email already exists! ,please try again')


    username = StringField(label="Username" , validators=[Length(min = 6 ,max=30),DataRequired()])
    email = StringField(label="Email Address" ,validators=[Email(),DataRequired()])
    password= PasswordField(label="Password" , validators=[Length(min = 6),DataRequired()])
    cPassword = PasswordField(label="Confirm Password" , validators=[EqualTo('password'),DataRequired()])
    submit = SubmitField(label="Create Account")
    
class LoginForm(FlaskForm):
    username = StringField(label="username")
    password = PasswordField(label="password")
    submit = SubmitField(label="Login")
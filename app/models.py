from app import db, login_manager
from app.extensions import bcrypt
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(length=30), nullable=False, unique=True)
    email = db.Column(db.String(length=30), nullable=False)
    password = db.Column(db.String(length=60), nullable=False)

    def __repr__(self):
        return f'{self.username}-{self.email}'

    @property
    def Hpassword(self):
        raise AttributeError("Password is not readable")

    @Hpassword.setter
    def Hpassword(self, plain_txt_password):
        self.password = bcrypt.generate_password_hash(plain_txt_password).decode('utf-8')

    def check_password(self, attempted_password):
        return bcrypt.check_password_hash(self.password, attempted_password)

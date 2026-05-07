# Spotify Clone

A full-stack **Spotify Clone** built from scratch using **HTML**, **CSS**, **JavaScript**, and **Flask** — replicating Spotify's dark UI, music playback engine, and user authentication system.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## Features

- **Full music player** — play, pause, skip prev/next, auto-advance to next track
- **Draggable seekbar** — click or drag to seek anywhere in a track with a live green progress fill
- **Dynamic song list** — tracks are fetched live from the Flask backend via a JSON API and rendered into the DOM at runtime
- **User authentication** — signup, login, and logout with bcrypt-hashed passwords and also firebase google signup/login included
- **SQLite database** — persistent user storage via Flask-SQLAlchemy
- **Responsive layout** — flexbox-driven design that adapts across screen sizes

---

## Project Structure

```
Spotify-Clone/
├── run.py                        # Entry point — creates DB tables, starts dev server on port 8000
└── app/
    ├── __init__.py               # Flask app config, SQLAlchemy, Bcrypt, LoginManager init
    ├── extensions.py             # Extension imports shared across modules
    ├── models.py                 # User model with bcrypt password hashing
    ├── form.py                   # WTForms — SignupForm & LoginForm with custom validators
    ├── routes.py                 # URL routes: /, /signup, /login, /songs (JSON API)
    ├── requirements.txt          # Python dependencies
    ├── static/
    │   ├── css/
    │   │   ├── style.css         # Main dark theme stylesheet
    │   │   └── utility.css       # Utility classes
    │   ├── js/
    │   │   └── script.js         # Full music player engine (async, Fetch API, Web Audio API)
    │   ├── images/               # SVG icons (logo, home, search, install, send)
    │   └── songs/                # MP3 audio files served as static assets
    └── templates/
        ├── index.html            # Main player UI (Jinja2 template)
        ├── login.html            # Login page
        └── signup.html           # Signup page
```

---

## Getting Started

### Prerequisites
- Python 3.8+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prem-programs/Spotify-Clone.git
cd Spotify-Clone

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r app/requirements.txt

# 4. Add a .env file with your secret key
echo "SECRET_KEY=your_secret_key_here" > .env

# 5. Run the app
python run.py
```

Visit **http://localhost:8000** in your browser.

---

## Dependencies

| Package | Purpose |
|---|---|
| Flask | Web framework & routing |
| Flask-SQLAlchemy | ORM & SQLite database |
| Flask-Bcrypt | Password hashing |
| Flask-Login | Session-based authentication |
| Flask-WTF | Form handling & CSRF protection |
| python-dotenv | Environment variable management |

---

## License

This project is for **educational purposes only.**  
Spotify is a trademark of Spotify AB — this project is not affiliated with or endorsed by Spotify.

---

## Author

**Prem** — [@prem-programs](https://github.com/prem-programs)


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCRpmh5ncsdBH_0pWo8E1sZOfGxHcgkdZI",
    authDomain: "spotify-a21fc.firebaseapp.com",
    projectId: "spotify-a21fc",
    storageBucket: "spotify-a21fc.firebasestorage.app",
    messagingSenderId: "675232445615",
    appId: "1:675232445615:web:ad14e3f9d645df38e0d05a",
    measurementId: "G-J3VYNX907N"
};
// initialising firebase ad 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Auth button element
const authBtn = document.getElementById("google-btn");
const Lbutton =  document.getElementById("Lgoogle-btn");
const navLoginBtn = document.querySelector(".login a");

// Handle button click - toggles between login and logout
if (authBtn) {
    authBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link navigation
        const user = auth.currentUser;
        
        if (user) {
            // User is logged in - sign out
            signOut(auth)
                .then(() => {
                    console.log("Logged out!");
                })
                .catch((error) => console.log(error.message));
        } else {
            // User is not logged in - sign in with Google
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("Logged in!", result.user);
                    window.location.href = "/";
                })
                .catch((error) => console.log(error.message));
        }
    });
} else {
    console.error("google-btn element not found");
}
if (Lbutton) {
    Lbutton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link navigation
        const user = auth.currentUser;
        
        if (user) {
            // User is logged in - sign out
            signOut(auth)
                .then(() => {
                    console.log("Logged out!");
                })
                .catch((error) => console.log(error.message));
        } else {
            // User is not logged in - sign in with Google
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("Logged in!", result.user);
                    window.location.href = "/";
                })
                .catch((error) => console.log(error.message));
        }
    });
} else {
    console.error("Lgoogle-btn element not found");
}

if (navLoginBtn) {
    navLoginBtn.addEventListener("click", (e) => {
        const user = auth.currentUser;
        if (user) {
            e.preventDefault();
            signOut(auth)
                .then(() => {
                    console.log("Logged out!");
                })
                .catch((error) => console.log(error.message));
        }
    });
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        console.log("User logged in:", user.displayName);
        if (navLoginBtn) {
            navLoginBtn.textContent = "Logout";
            navLoginBtn.removeAttribute("href");
        }
    } else {
        // User is logged out
        console.log("User logged out");
        if (navLoginBtn) {
            navLoginBtn.textContent = "Log in";
            navLoginBtn.href = "/login";
        }
    }
});


async function getSongs() {
    try {
        const res = await fetch('/songs');
        if (!res.ok) return [];
        const files = await res.json();
        // return full static URLs for the client
        return files.map(f => `/static/songs/${encodeURIComponent(f)}`);
    } catch (err) {
        console.error('Failed to fetch /songs', err);
        return [];
    }
}

let playlistAudio = null;
let currentSongIndex = -1;
let songs = [];
let playBtn = null;
let seekbar = null;
let seekCircle = null;
let isSeeking = false;

const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="black">
                    <path d="M8 5v14l11-7z" />
                </svg>`;

const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="black">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>`;

function setPlayIcon(isPlaying) {
    if (playBtn) {
        playBtn.innerHTML = isPlaying ? pauseSVG : playSVG;
    }
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function updateSeekbarFromAudio() {
    if (!playlistAudio || isSeeking || !seekCircle || playlistAudio.duration <= 0) return;
    const rect = seekbar.getBoundingClientRect();
    const handleWidth = seekCircle.offsetWidth;
    const availableWidth = rect.width - handleWidth;
    const percent = clamp(playlistAudio.currentTime / playlistAudio.duration, 0, 1);
    seekbar.style.background =
        `linear-gradient(to right, #1db954 ${percent * 100}%, #444 ${percent * 100}%)`;

    seekCircle.style.left = `${percent * availableWidth}px`;
}

function seekAudioToPosition(clientX) {
    if (!seekbar || !seekCircle) return;
    const rect = seekbar.getBoundingClientRect();
    const handleWidth = seekCircle.offsetWidth;
    const availableWidth = rect.width - handleWidth;
    const offsetX = clamp(clientX - rect.left - handleWidth / 2, 0, availableWidth);
    const percent = offsetX / availableWidth;

    seekbar.style.background =
        `linear-gradient(to right, #1db954 ${percent * 100}%, #444 ${percent * 100}%)`;

    seekCircle.style.left = `${offsetX}px`;
    if (playlistAudio && playlistAudio.duration > 0) {
        playlistAudio.currentTime = percent * playlistAudio.duration;
    }
}

function bindSeekbarEvents() {
    if (!seekbar || !seekCircle) return;
    seekbar.style.cursor = "pointer";
    seekCircle.style.cursor = "grab";

    const startSeek = (event) => {
        event.preventDefault();
        isSeeking = true;
        seekCircle.setPointerCapture(event.pointerId);
        seekCircle.style.cursor = "grabbing";
        seekAudioToPosition(event.clientX);
    };

    const moveSeek = (event) => {
        if (!isSeeking) return;
        seekAudioToPosition(event.clientX);
    };

    const endSeek = (event) => {
        if (!isSeeking) return;
        isSeeking = false;
        seekCircle.style.cursor = "grab";
        seekAudioToPosition(event.clientX);
    };

    seekbar.addEventListener("pointerdown", startSeek);
    seekCircle.addEventListener("pointerdown", startSeek);
    window.addEventListener("pointermove", moveSeek);
    window.addEventListener("pointerup", endSeek);
    window.addEventListener("pointercancel", endSeek);
}

function createAudio(trackUrl) {
    const audio = new Audio(trackUrl);
    audio.volume = 1;
    audio.muted = false;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
        console.error("Audio load failed for:", trackUrl, audio.error);
    });
    audio.addEventListener("loadedmetadata", () => {
        updateSeekbarFromAudio();
    });
    audio.addEventListener("timeupdate", () => {
        updateSeekbarFromAudio();
    });
    audio.addEventListener("ended", () => {
        if (currentSongIndex + 1 < songs.length) {
            currentSongIndex += 1;
            playlistAudio = createAudio(songs[currentSongIndex]);
            playlistAudio.play();
        } else {
            currentSongIndex = -1;
            playlistAudio = null;
            setPlayIcon(false);
        }
    });
    return audio;
}

function playCurrentSong() {
    if (songs.length === 0) return;
    if (currentSongIndex < 0) {
        currentSongIndex = 0;
    }
    if (playlistAudio) {
        playlistAudio.pause();
    }
    playlistAudio = createAudio(songs[currentSongIndex]);
    playlistAudio.play();
    setPlayIcon(true);
}

function togglePlayback() {
    if (!playlistAudio) {
        playCurrentSong();
        return;
    }
    if (playlistAudio.paused) {
        playlistAudio.play();
        setPlayIcon(true);
    } else {
        playlistAudio.pause();
        setPlayIcon(false);
    }
}



async function main() {
    let currentSong = null;
    // get songs
    songs = await getSongs();

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""; // Clear existing list
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        let fileName = decodeURIComponent(song.split('/').pop()).trim();
        let displayName = fileName.replaceAll(".mp3", "").trim();
        let li = document.createElement("li");
        li.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="6.5" cy="18.5" r="3.5" />
                <circle cx="18" cy="16" r="3" />
                <path d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16" />
                <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" />
            </svg>
            <div class="info">
                <div>${displayName}</div>
                <div>Artist name</div>
            </div>`;
        // Add click event to play this song
        li.addEventListener("click", function () {
            if (playlistAudio) {
                playlistAudio.pause();
            }
            currentSongIndex = i;
            playlistAudio = createAudio(songs[currentSongIndex]);
            playlistAudio.play();
            setPlayIcon(true);
            currentSong = fileName;
        });
        songUl.appendChild(li);
    }

    console.log("Playlist ready. Click a song or press play to start.");
    playBtn = document.querySelector(".play");
    seekbar = document.querySelector(".seekbar");
    seekCircle = document.querySelector(".circle");
    bindSeekbarEvents();

    if (playBtn) {
        setPlayIcon(false);
        playBtn.addEventListener("click", togglePlayback);
    }
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    // add event listener to prev and next
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (playlistAudio) playlistAudio.pause();
            if (currentSongIndex > 0) {
                currentSongIndex -= 1;
                playlistAudio = createAudio(songs[currentSongIndex]);
                playlistAudio.play();
                setPlayIcon(true);
            } else {
                currentSongIndex = -1;
                playlistAudio = null;
                setPlayIcon(false);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (playlistAudio) playlistAudio.pause();
            if (currentSongIndex + 1 < songs.length) {
                currentSongIndex += 1;
                playlistAudio = createAudio(songs[currentSongIndex]);
                playlistAudio.play();
                setPlayIcon(true);
            } else {
                currentSongIndex = -1;
                playlistAudio = null;
                setPlayIcon(false);
            }
        });
    }

}

main()
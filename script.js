

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        const href = element.getAttribute("href") || element.href;
        if (!href) continue;
        const normalizedHref = href.replace(/\\/g, "/");
        if (normalizedHref.endsWith(".mp3")) {
            const fileName = decodeURIComponent(normalizedHref.split("/").pop());
            songs.push(fileName);
        }
    }

    return songs;
}

let playlistAudio = null;
let currentSongIndex = -1;
let songs = [];
let playBtn = null;

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

function createAudio(track) {
    const normalizedTrack = track.replace(/\\/g, "/").replace(/^\/+/, "");
    const encodedPath = normalizedTrack.split("/").map(encodeURIComponent).join("/");
    const audio = new Audio(`/${encodedPath}`);
    audio.volume = 1;
    audio.muted = false;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
        console.error("Audio load failed for:", track, "/ normalized:", normalizedTrack, "/ url:", `/songs/${encodedPath}`, audio.error);
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
    for (const song of songs) {
        let fileName = song.replace(/^.*[\\/]/, "").trim();
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
            </div>
            <div class="playnow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="white">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        `;
        // Add click event to play this song
        li.addEventListener("click", function() {
            if (playlistAudio) {
                playlistAudio.pause();
            }
            currentSongIndex = songs.indexOf(fileName);
            if (currentSongIndex < 0) {
                currentSongIndex = 0;
            }
            playlistAudio = createAudio(songs[currentSongIndex]);
            playlistAudio.play();
            setPlayIcon(true);
            currentSong = fileName;
        });
        songUl.appendChild(li);
    }

    console.log("Playlist ready. Click a song or press play to start.");
    playBtn = document.querySelector(".play");

    if (playBtn) {
        setPlayIcon(false);
        playBtn.addEventListener("click", togglePlayback);
    }
}

main()
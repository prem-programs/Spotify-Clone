

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }

    }
    return (songs);


}

async function main() {
    // get songs
    let songs = await getSongs()
    //play song 
    let music = new Audio(songs[0]);
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>${song}</li>`;
    }


    console.log("song is playing ")
    let playBtn = document.querySelector(".play");

    if (playBtn) {
        const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="black">
                        <path d="M8 5v14l11-7z" />
                    </svg>`;

        const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="black">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>`;
        playBtn.addEventListener("click", () => {

            if (music.paused) {
                music.play();
                playBtn.innerHTML = pauseSVG;
            } else {
                music.pause();
                playBtn.innerHTML = playSVG;
            }

        });
    }

}

main()
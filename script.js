

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
            songs.push(element.href.split('%5')[2])
        }

    }
    return (songs);


}

async function main() {
    // get songs
    let songs = await getSongs()
    //play song 
    let music = new Audio(songs[0]);
    //display songs on playlist
    
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="6.5" cy="18.5" r="3.5" />
                                    <circle cx="18" cy="16" r="3" />
                                    <path
                                        d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16" />
                                    <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" />
                                </svg>
                                <div class="info">
                                    <div>${song.replaceAll("%20","").replaceAll(".mp3"," ")}</div>
                                    <div>Artist name</div>
                                </div>
                                
                                <div class="playnow">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"
                                        fill="white
                                        ">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
        </li>`;
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
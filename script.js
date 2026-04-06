

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
        playBtn.addEventListener("click", () => {
            
        if (music.paused){
            music.play()
        }  
        else{
            music.pause()
        }
        });
    }
    
    


}

main()
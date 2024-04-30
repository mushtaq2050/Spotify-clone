let currentsong=new Audio()
let songs;
let currfolder;
async function getsongs(folder){
    currfolder=folder;
    let a = await fetch(`${folder}/`)
    let response= await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
     songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
      //    SHOW all the songs in playlist
      let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
      songul.innerHTML=""
      for (const song of songs) {
       songul.innerHTML=songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
       <div class="info">
           <div>${song.replaceAll("%20",  " ")}</div>
           <div>Mushtaq</div>
       </div>
       <div class="playnow">
           <span>Play now</span>
           <img class="invert" src="img/play.svg" alt="">
       </div>
   </li>`; 
      }
   //    Attach an eventlister to each song
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

       e.addEventListener("click", element=>{
           console.log(e.querySelector(".info").firstElementChild.innerHTML)
           playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
       })
   })
   return songs
}
const playmusic=(track, pause=false)=>{
    currentsong.src=`/${currfolder}/` + track
    if(!pause){
        currentsong.play()
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function albumdisplay(){
    let a = await fetch(`songs/`)
    let response= await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder= e.href.split("/").slice(-2)[0]
            // get metadata of folder
            let a = await fetch(`songs/${folder}/info.json`)
            let response= await a.json();
            cardcontainer.innerHTML= cardcontainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div class="play">
                <img src="img/play.svg" alt="">
            </div>
            <img src="/songs/${folder}/cover.jpg.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`

        }
    }
    // load the playlist whenever play is clicked on card
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
    })
})
}

 async function main(){
    // Get all the songs
     await getsongs("songs/ncs")
   playmusic(songs[0], true)
// Display all the albums 
albumdisplay()
// Attach an eventlistener to play next and previous
play.addEventListener("click", ()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src="img/pause.svg"
    }
    else{
        currentsong.pause()
        play.src="img/play.svg"
    }
})
// add eventlistener for timeupdate
currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
 })
//  Attach eventlistener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})
// Add eventlistener to Hamburger
document.querySelector(".hamburger").addEventListener("click", (e)=>{
    document.querySelector(".lift").style.left= "0"
})
// Add eventlistener to close
document.querySelector(".close").addEventListener("click", (e)=>{
    document.querySelector(".lift").style.left= "-120%"
})
// Add an event listener to previous song
previous.addEventListener("click", ()=>{
    console.log("previous was clicked")
    currentsong.pause()
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index-1) >= 0){
        playmusic(songs[index-1])
    }
})
// Add an event listener to next song
next.addEventListener("click", ()=>{
    console.log("next was clicked")
    currentsong.pause()
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length - 1){
        playmusic(songs[index+1])
    }
})
// add eventlistener to volume
document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    currentsong.volume=parseInt(e.target.value)/100
})
// Add eventlistener to mute the track
document.querySelector(".volume>img").addEventListener("click", (e)=>{
    if(e.target.src.includes("vlume.svg")){
        e.target.src=e.target.src.replace("vlume.svg", "mute.svg")
        currentsong.volume=0
        document.querySelector(".volume").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace("mute.svg", "vlume.svg")
        currentsong.volume=0.1
        document.querySelector(".volume").getElementsByTagName("input")[0]=.1
    }
})
}
 main()
 
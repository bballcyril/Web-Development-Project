var request = new XMLHttpRequest();
var itunesRequest = new XMLHttpRequest();
var lyrics = document.getElementById("lyrics");
var submit = document.getElementById("submit");
var artist = document.getElementById("artist");
var song = document.getElementById("song");
var player = document.getElementById("player");
var formattedArtist;
var formattedSong;
var data;

//Fetches JSON data from the lyrics.ovh api
submit.addEventListener("click",function(){
  console.log("submit");
  lyrics.innerHTML = "";
  formattedArtist = formatInput(artist.value);
  formattedSong = formatInput(song.value);
  console.log(formattedArtist);
  request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
  request.addEventListener("load",whenLoaded);
  request.send();

  player.innerHTML= " ";
  //Webplayer
  itunesRequest.open("GET","https://itunes.apple.com/search?term=drake&one&dance");
  itunesRequest.addEventListener("load",loadItunes);
  itunesRequest.send();
});
//Listens for an enter keypress
document.addEventListener("keypress",function(key){
  if(key.keyCode ===13){
    console.log("submit");
    lyrics.innerHTML = "";
    formattedArtist = formatInput(artist.value);
    formattedSong = formatInput(song.value);
    console.log(formattedArtist);
    request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
    request.addEventListener("load",whenLoaded);
    request.send();

    player.innerHTML= " ";
    //Webplayer
    itunesRequest.open("GET","https://itunes.apple.com/search?term=drake&one&dance");
    itunesRequest.addEventListener("load",loadItunes);
    itunesRequest.send();
  }
});

function whenLoaded(){
  //data = JSON.parse(request.responseText);
  console.log("loaded");
  console.log(request.status);
  if(request.status === 404){
    lyrics.innerHTML += "Lyrics not found";
    console.log("Lyrics not found");
  }else{
  data = request.responseText;
  var output = format(data);
  lyrics.innerHTML += output;
  console.log(data);
  }
}
function loadItunes(){
  var items = JSON.parse(itunesRequest.responseText);
  var songObject;
  console.log(JSON.parse(itunesRequest.responseText));
  console.log("itunes loaded");
  for(var i =0;i<items.resultCount;i++){
    var results = items.results[i].trackName.toLowerCase();
    if(results.includes(song.value.toLowerCase())){
      songObject = items.results[i];
      var previewUrl = songObject.previewUrl;
      console.log(previewUrl);
      player.innerHTML = "<source src ="+previewUrl+">";
      console.log(i);

      //Stops loop once item is found
       break;
    }
  }
}
//Inserts an "_" at each space
function formatInput(input){
  var formatted = "";
  var pos = input.indexOf(" ");
  for(var i =0;i<input.length;i++){
    if(pos===i){
      formatted+= "_";
    }else{
      formatted+=input.substring(i,i+1);
    }
    pos = input.indexOf(" ", i);
  }
  return formatted;
}
//Format the JSON data
function format(data){
  var formatted =" ";
  //Position of the start of the lyrics
  var pos = data.indexOf(":")+1;
  //Index of the next \n
  var nextLinePos = data.indexOf("\\n",pos);
  //Iterate through each character
  for(var i=pos;i<data.length-1;i++){
    if(nextLinePos===i){
      //Add a break into the html if i is the start of \n
      formatted+= "<br>";
      i+=1;
    }else{
    formatted+= data.substring(i,i+1);
    }
    //Gets the next index of \n
    nextLinePos = data.indexOf("\\n",i);
  }
  return formatted;
}

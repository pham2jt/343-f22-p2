
// get the input elements
const searchInput = document.getElementById("search");
const searchForm = document.getElementById("searchForm");
const spotifyClientID = "11de459dc28144f99f45c07274449388";
const spotifyClientSecret = "e992dfa997bb455aa83fe3d4446c9092";
const lyricApiKey = "90f58a0ddd188f462867b24d92f70aee";
// get the div element with the ID "results"
const resultsDiv = document.getElementById("results");

fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + spotifyClientID + '&client_secret=' + spotifyClientSecret,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
.then(r => r.json())
.then(r => {
  console.log(r.access_token)
  let spotifyApiKey = r.access_token;
  // add an event listener for the submit event
  searchForm.addEventListener("submit", event => {
  // prevent the default form submission behavior
  event.preventDefault();
  const query = searchInput.value;
  // perform the search for the artist's top songs and retrieve the lyrics
  searchForArtistTopSongs(spotifyApiKey, query);
});
})

// define the function to search for the artist's top songs and retrieve the lyrics
function searchForArtistTopSongs(spotifyApiKey, searchQuery) {
  // use the Spotify API to search for the artist's top songs
  console.log(searchQuery);
  fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=artist&limit=1`, {
    headers: {
      Authorization: `Bearer ${spotifyApiKey}`
    }
  })
    .then(response => response.json())
    .then(data => {
      // log the response data in the console
      console.log(data);

      // get the artist's ID from the response data
      const artistName = data.artists.items[0].name;
      const artistId = data.artists.items[0].id;

      // use the Spotify API to get the artist's top songs
      fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
        headers: {
          Authorization: `Bearer ${spotifyApiKey}`
        }
      })
        .then(response => response.json())
        .then(data => {
          // log the response data in the console
          console.log(data);

          // get the song IDs from the response data
          const songNames = data.tracks.map(track => track.name);
          
          const strSongs = songNames.join(" ");
          console.log(strSongs);
          wordcloud(strSongs, artistName);
          })
        });
};
    
function wordcloud(string, name) {
  fetch(`https://quickchart.io/wordcloud?text=${string}&format=png`)
    .then(response => response.blob())
    .then(blobResponse => {
      data = blobResponse;
      const urlCreator = window.URL || window.webkitURL;
      // create elements
      var fig = document.createElement("figure");
      var img = new Image();
    
      img.src = urlCreator.createObjectURL(data);
      img.caption

      fig.appendChild(img);

      // create caption
      var cap = document.createElement("figcaption");
      cap.innerText = `This is a word cloud of ${name}'s top songs on Spotify`;

      fig.appendChild(cap);
      resultsDiv.appendChild(fig);

      // create clear button
      var button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerText = "click to clear this image";
      button.setAttribute("class", "btn btn-secondary");
      button.addEventListener("click", event => {
        fig.innerHTML = "";
      })

      fig.appendChild(button);
    })
  
};
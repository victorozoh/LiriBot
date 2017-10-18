var fs = require('fs');
var request = require('request');
// spotify
//var spotify = require('spotify');
var Spotify = require("node-spotify-api");
// twitter
var keys = require('./keys.js');
var Twitter = require('twitter');

// get relevant command line arguments
var command = process.argv[2];
var commandArg = process.argv[3];
for(i=4; i<process.argv.length; i++){
	    commandArg += '+' + process.argv[i];
}

// twitter client
var client = new Twitter({
     consumer_key: keys.twitterKeys.consumer_key,
     consumer_secret: keys.twitterKeys.consumer_secret,
     access_token_key: keys.twitterKeys.access_token_key,
     access_token_secret: keys.twitterKeys.access_token_secret
});
var params = {count: 20};

// spotify client
var spotify = new Spotify({
        id: "783cd04e45ad495b9ba619a79da80d81",
        secret: "21d3f08418864e3dbb94746ac0e5f316"
});

function getMyTweets(){
     client.get('statuses/user_timeline', params, function(error, tweets, response){
          if (!error) {
               for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text + " Created on: " + tweets[i].created_at);
                    fs.appendFile('log.txt', tweets[i].text + " Created on: " + tweets[i].created_at + "\n");
               }
               fs.appendFile('log.txt', "=================================================================");
          } else {
               console.log(error);
          }
     });
}// end of getMyTweets function

function getMySong() {
     var queryInput;
     if (commandArg === undefined) {
          queryInput = 'The Sign by Ace of Base';
     }else {
       queryInput = commandArg;
     }
     spotify.search({ type: 'track', query: queryInput}, function(err, data) {
         if ( err ) {
             console.log('Error occurred: ' + err);
             return;
         }
         console.log("Artist: " + data.tracks.items[0].artists[0].name);
         console.log("Song Name: " + data.tracks.items[0].name);
         console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
         console.log("Album: " + data.tracks.items[0].album.name);
         fs.appendFile('log.txt', "Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name  + "\n" + "=================================================================");
     });
}// end of getMySong function

function getMyMovie() {
  var queryInput;
  if (commandArg === undefined) {
       queryInput = "Mr. Nobody";
  }else {
    queryInput = commandArg;
  }
     request('http://www.omdbapi.com/?t=' + queryInput + "&tomatoes=true&plot=short&apikey=40e9cece", function (error, response, body) {
          if (!error && response.statusCode == 200) {
               var movieData = JSON.parse(body);
               console.log("Title: " + movieData.Title);
               console.log("Year: " + movieData.Year);
               console.log("IMDB Rating: " + movieData.imdbRating);
               console.log("Country: " + movieData.Country);
               console.log("Language: " + movieData.Language);
               console.log("Plot: " + movieData.Plot);
               console.log("Actors: " + movieData.Actors);
               console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
               console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
               fs.appendFile('log.txt', "Title: " + movieData.Title + "\n" + "Year: " + movieData.Year + "\n" + "IMDB Rating: " + movieData.imdbRating + "\n" + "Country: " + movieData.Country + "\n" + "Language: " + movieData.Language + "\n" + "Plot: " + movieData.Plot + "\n" + "Actors: " + movieData.Actors + "\n" + "Rotten Tomatoes Rating: " + movieData.tomatoUserRating + "\n" + "Rotten Tomatoes URL: " + movieData.tomatoURL + "\n" + "=================================================================");
          }
          else {
               console.log(error);
          }
     });
}// end of getMyMovie function

function readTextFile(){
	console.log("Reading random.txt");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data
     	var dataArr = data.split(',');
        command = dataArr[0];
        commandArg = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            commandArg = commandArg + "+" + dataArr[i];
        }
        //run action
		    selectCommand();

    	}//end else

    });//end readfile

}//end of readTextFile function

function selectCommand() {
  switch(command) {
       case "my-tweets":
            getMyTweets();
            break;
       case "spotify-this-song":
            getMySong();
            break;
       case "movie-this":
            getMyMovie();
            break;
       case "do-what-it-says":
            readTextFile();
            break;
  }
}// end of selectCommand function

// make function call
selectCommand();

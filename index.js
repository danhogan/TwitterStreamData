var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Bot = require('./node_modules/twit/examples/bot')
var twitConfig = require('./twitConfig');

var bot = new Bot(twitConfig);
var stream = bot.twit.stream('statuses/filter', {track: 'google'});

app.use('/', express.static(__dirname));

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});


stream.on('tweet', function(tweet){
	//console.log(tweet.text + '\n');

	var time = tweet.created_at.substring(11, 19);
	var myHour = (parseInt(time.substring(0,2)) - 7).toString();
	var myTime = myHour + time.substring(2, 8);

	var tweetObject = {
		//whole: tweet,
		text: tweet.text,
		time: myTime,
		user: tweet.user.screen_name
	};

	io.emit('leggo', tweetObject);
});

http.listen(3002, function(){
	console.log('listening on *:3002');
});


function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
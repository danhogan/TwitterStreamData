jQuery(function($){
//********


var socket = io();

var dateTime = new Date();
var startTime = dateTime.today() + " @ " + dateTime.timeNow();
$('#startTime').text(startTime);

var minuteCounter = 0;
var totalMinutes = 0;
var tweetsForThisMinute = 0;
var minMinute = 9999999;
var maxMinute = 0;
var minHour = 9999999;
var maxHour = 0;
var total = 0;
var hourArray = []; //number of tweets for each minute here
var dayArray = []; //array of hourArrays
var data = [];
var data2 = [];
var tweetsForThisHour = 0;
var tweetsForThisDay = 0;


setInterval(function(){
	tweetsForThisHour += tweetsForThisMinute;
	totalMinutes++;
	hourArray.push(tweetsForThisMinute);

	//add actual number at the top of each bar
	draw('#chart', data, hourArray, tweetsForThisMinute);

	//make a single, horizontal, red line on the graph that shows the average
	$('#perMinute').text((Math.round((tweetsForThisHour/totalMinutes)*100)/100).toFixed(2));

	if(tweetsForThisMinute < minMinute){
		minMinute = tweetsForThisMinute;
		$('#minMinute').text(tweetsForThisMinute);
	}

	if(tweetsForThisMinute > maxMinute){
		maxMinute = tweetsForThisMinute;
		$('#maxMinute').text(tweetsForThisMinute);
	}
	
	tweetsForThisMinute = 0;

	if(hourArray.length == 60) {
		data = [];
		tweetsForThisDay += tweetsForThisHour;
		dayArray.push(hourArray);
		hourArray = [];

		//add actual number at the top of each bar
		draw('#chart2', data2, dayArray, tweetsForThisHour);

		//make a single, horizontal, red line on the graph that show the average
		$('#perHour').text((Math.round((tweetsForThisDay/dayArray.length)*100)/100).toFixed(2));

		if(tweetsForThisHour < minHour){
			minHour = tweetsForThisHour;
			$('#minHour').text(tweetsForThisHour);
		}

		if(tweetsForThisHour > maxHour){
			maxHour = tweetsForThisHour;
			$('#maxHour').text(tweetsForThisHour);
		}

		tweetsForThisHour = 0;
		totalMinutes = 0;
		minMinute = 9999999;
		maxMinute = 0;
	}
}, 60000);

socket.on('leggo', function(msg){
	tweetsForThisMinute++;
	$('#thisMinute').text(tweetsForThisMinute)
	//draw2('#chart', data, hourArray, tweetsForThisMinute) //only draw newest bar and y-axis

	total++;
	$('#total').text(total);
});


//********
});
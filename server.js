var Bot = require('slackbots');

var graph = require('fbgraph');
 
const kwintesencja_id = 962955043715236;
const access_token = "EAACEdEose0cBAHxnbRsg3lTV0GG7EYZAxJLhRbQBMoEwfFxE4g8MCGGTUQSJz6bwzRrRHq8NIaKw9LEN4qVwbu3DkCnJoKM8gUz7Kn6ZA7ygcNQsmhgZB1wfX8PWa3irkUZBE4klpWKh6DZBZBGD4iIBmK4T1ZC57LVUmXfQrGfBSzWMGarxv0TWwfCdUEICGYZD";

graph.setAccessToken(access_token);

const postRecentLunch = function(channel, bot){
	graph.get(String(kwintesencja_id) + "/feed", function(err, res) {
		var recentFeed = res["data"][0];
        var lastDinner = recentFeed["message"];
        var time = recentFeed["created_time"];
        console.log('time: '+time);
        console.log('recent dinner: '+ lastDinner);
        bot.postMessageToGroup(channel, time+"\n"+lastDinner);
    });
};
// create a bot
var settings = {
//    token: 'xoxb-231195319477-cvksXLKpImZjqMSWIdTv7ZTS',
    token: 'xoxb-229464761044-L7nfFVIs5q3eNWY5grFlyAR4',
    name: 'kwintesencja'
};
var bot = new Bot(settings);

bot.on('start', function() {
   // bot.postMessageToChannel('random', 'Hello channel!');
   // bot.postMessageToUser('lukasz', 'hello bro!');
    //bot.postMessageToGroup('some-private-group', 'hello group chat!');
});

bot.on('message', function() {
    
    postRecentLunch('lunch',bot);
});


console.log('bot work started');
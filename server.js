var Bot = require('slackbots');
var graph = require('fbgraph');

const kwintesencja_id = 962955043715236;
var CronJob = require('cron').CronJob;

const months = ['Stycznia', 'Lutego','Marca','Kwietnia','Maja','Czerwca', 'Lipca','Sierpnia','Września',  'Października', 'Listopada','Grudnia'];

const access_token = "EAACEdEose0cBAI13TzsG6lSInZA8PhfiEQ93HbiHecM0IEEZA2nxbr95gAsGEFqJ7Dzfe1q4HSmrDHHjXvrZC44jdWGrwLFNzdX9fFkwM1Hbtcuzv2xqZCZCK4yPIj1DWsd6DZCOKvdikfccZBOuZCwCjqownGdPLVQELKi9BmniSShbl5sJPQ6lHNupCQAQZAGmDyVMNMsgGTgZDZD";

graph.setAccessToken(access_token);

const translate = require('google-translate-api');

const getTranslation = function(dinner, callback){
 
    translate(dinner, {from: 'pl', to: 'en'}).then(res => {
    console.log('res.text: '+res.text);
    console.log('res.text.autoCorrected: '+res.from.text.autoCorrected);
    console.log('res.from.text.value: '+res.from.text.value);
    console.log('res.from.text.didYouMean: '+res.from.text.didYouMean);
    callback(undefined,res);
}).catch(err => {
    callback(err, undefined);
});   
}

const parseDinnerData = function(res){
    var recentFeed = res["data"][0];
    var lastDinner = recentFeed["message"];
    var time = recentFeed["created_time"];
    return { 
        time: time,//time of posting this message on facebook
        lastDinner: lastDinner//post content
    };
}

const getDateInfo = function(){
    var date = new Date();
    var day = date.getUTCDay();
    var month = date.getUTCMonth();
    var year = date.getUTCFullYear();
    var timeInfo = '\n*Kwintesencja Menu na dzień ' + day + " " + months[month] + " " + year + "*\n";
    return timeInfo;
}

const postRecentLunch = function(channel, bot){
	
    graph.get(String(kwintesencja_id) + "/feed", function(err, res) {
		
        var dinnerInfo = parseDinnerData(res);
        var timeInfo = getDateInfo();
        var lastDinnerInfo = dinnerInfo.lastDinner;
        
        getTranslation(lastDinnerInfo, function(error,response){
            
            var polishInfo = timeInfo + "\n" + lastDinnerInfo;
            if(error){
                bot.postMessageToChannel(channel, polishInfo);    
            }else{
                var englishInfo = response.text;
                bot.postMessageToChannel(channel, polishInfo+"\n\nFor *Emmanuel* ;)\n\n"+englishInfo);
            }
        });
    });
};

const startCronJob = function(bot){
    var job = new CronJob({
    cronTime: '00 30 11 * * 1-5',
    onTick: function() {
        /* 
        Runs every weekday (Monday through Friday) at 11:30:00 AM.
        It does not run on Saturday or Sunday.
        */
        console.log('tick!');
        postRecentLunch('test_bots_channel', bot); 
    }
        
    });
    job.start();
}

var settings = {
    token: 'xoxb-232022068086-02HR3UMfFGZTXhFI7tENMAfb',
    name: 'kwintesencja2'
};
var bot = new Bot(settings);

bot.on('start', function() {
    console.log('bot started');
    //uncomment - for testing purposes
    //postRecentLunch('test_bots_channel',bot);

    startCronJob(bot);
});

bot.on('message', function() {
    //do nothing
});
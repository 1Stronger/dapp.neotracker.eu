const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const tfsession = require('telegraf/session')
const { reply } = Telegraf
const bot = new Telegraf("YOUR_TOKEN_HERE");
var User = require('./models/User');
bot.use(tfsession());

// Command handling
bot.command('start', (ctx) => {
  ctx.reply('Hi there, type /help for list of commands');
  User.findOne({ userid :  ctx.message.from.id }, function(err, user) {
    if (!user){
        var newUser = new User();
        // set the user's local credentials
        newUser.userid = ctx.message.from.id;
        newUser.username = ctx.message.from.id;
        newUser.password = "start132"; //TODO: some random password
	newUser.save(function(err) {
            if (err)
                throw err;
			return ctx.reply('Your account is created:\n Username: ' + newUser.username + "\n Password: " + newUser.password);
        });
    }  	
    else {
    	return ctx.reply('Your account is already created:\n Username: ' + user.username + "\n Password: " + user.password);
    }

  });
})

bot.command('changepassword', (ctx) => {
    var password=ctx.message.text.replace("/changepassword", "").trim();
    if (password == "")return ctx.reply('Please enter valid password(at least 6 chars long). \n /changepassword <password>(6 chars long)');
    User.findOne({ userid :  ctx.message.from.id }, function(err, user) {
    	if (user){
		user.password = password;
		user.save(function(err) {
	    		return ctx.reply('Your password is changed:\n Username: ' + user.username + "\n Password: " + user.password);
		});
       }  	
       else {
    	   return ctx.reply('Ops, something went wrong, your password wasn\'t changed');
       }
  });
})

bot.command('changeusername', (ctx) => {
    //console.log(ctx.message.text);
    console.log(ctx.message);

    var username=ctx.message.text.replace("/changeusername", "").trim();
    if (username == "")return ctx.reply('Please enter valid username. \n /changeusername <username>');
    console.log("username:" + username);
    User.findOne({ "username" :  username }, function(err, user) {
    	if (!user){
		User.findOne({ userid :  ctx.message.from.id }, function(err, userToUpdate) {
			userToUpdate.username = username;
			userToUpdate.save(function(err) {
		    		return ctx.reply('Your username is changed:\n Username: ' + userToUpdate.username + "\n Password: " + userToUpdate.password);
			});
		});
    }  	
    else {
    	return ctx.reply('Requested username is already in use');
    }

  });
})

bot.command('help', (ctx) => {
    return ctx.reply('Available commands:\n /start -> Get your account credentials \n /changeusername <username>\n /changepassword <password>');
})

function getTxidWithLink(txid){
	var explorer = "https://neotracker.io/";
	var operation = "tx/";
	var link = "<a href=\"" + explorer + operation + txid.replace("0x", "") + "\">" + txid + "</a>";
	return link;
}

module.exports = {

  start: function() {
    bot.startPolling();
  },

  sendPendingTransactionMessage: function(wallet, transaction) {
	var message = "Pending Transaction:\n" + getTxidWithLink(transaction.txid) + " \n\nTransaction type: " + transaction.type;

	var recipients = "\n\n Recipients:";
	for (var i = 0; i < transaction.vout.length; i++) { 
		var vout = transaction.vout[i];
		if (vout.address != null) recipients += "\n Receive Address: " + vout.address + " (" + vout.value + ")"; 
	}
	
	var senders = "\n\n Senders:";
	for (var i = 0; i < transaction.vin.length; i++) { 
		var vin = transaction.vin[i];
		if (vin.txid != null) senders += "\n Sender txid: " + getTxidWithLink(vin.txid); 
	}
	message += senders + recipients;
	bot.telegram.sendMessage(wallet.user_id, message, Object.assign({ 'parse_mode': 'HTML' }));
  },
}

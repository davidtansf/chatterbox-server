// YOUR CODE HERE:
var currentDate = new Date();
currentDate = currentDate.toISOString();
var index=0;
var myUserName;
var escapeChars = {'&':'&#38', '<':'&#60', '>':'&#62', '"':'&#34', "'":'&#39', '`':'&#96', '!':'&#33', '@':'&#64', '$':'&#36', '%':'&#37', '(':'&#40', ')':'&#41', '=':'&#61', '+':'&#43', '{':'&#123', '}':'&#125', '[':'&#91', ']':'&#93'};
var currentRoom = "Lobby";
var friends = {};

var filter = '{"createdAt" : {"$gte" : "' + currentDate + '"}}';
var app = {
	server : 'http://127.0.0.1:3000'
};

var Message = function(username, text, roomname){
	this.username = username;
	this.text = text;
	this.roomname = roomname;
}

app.init = function(){
	$('#messageBox').focus();
	
	setInterval(function(){
		
		console.log(filter);
		app.fetch(filter);
	}, 7000);
}

app.send = function(message){
  $.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'http://127.0.0.1:3000',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
}

app.fetch = function(filter){
var result = $.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'http://127.0.0.1:3000',
	  type: 'GET',
	  //data: ,/*'where=' + filter,*/
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message received');
	    currentDate = new Date();
	    currentDate=currentDate.toISOString();
	    //filter = '{"createdAt" : {"$gte" : "' + currentDate + '"}}';
	    console.log("now we have these results", data.results);
	    app.updateMessages(data.results);
	    index=data.results.length || 0;
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to receive message');
	  }
	});
}

app.clearMessages = function(){
	$('#chats').children().remove();
}

app.escapeCharacters = function(message){

	//message.text = JSON.stringify(message.text);
	//console.log(message.text.length);
	if (!message.text){
		message.text="";
	}
	var message_arr=message.text.split('') || [];
	for (var i = 0; i < message_arr.length; i++){
		if (escapeChars[message_arr[i]]){
			message_arr[i] = escapeChars[message_arr[i]];
		}
	}
	message.text=message_arr.join('');
	console.log(message.text);
  return message;
}

app.addMessage = function(message){
	message = app.escapeCharacters(message);
  if (message.roomname === currentRoom || currentRoom === "Lobby"){	
		$('#chats').prepend('<div class="chat ' + message.roomname + '"></div>').hide().slideToggle();
		$('#chats').children().first().append('<div class="username ' + message.username +'">'+ message.username +'</div>');
		$('#chats').children().first().append('<div class="message">'+ message.text +'</div>');
  	//$('#chats').children().fadeIn();
  }
  
	if(friends[message.username]){
		$('#chats').find('.' + message.username).addClass("friend");
	}
	
}

app.addRoom = function(roomName){

	$('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');	
	currentRoom = roomName;
	$('#roomSelect').val(roomName);
	console.log('current room', roomName);
}

app.addFriend = function(user) {
	friends[user] = user;
	$('#chats').find('.' + user).addClass('friend');
}

app.handleSubmit = function(messageText){
	$('#messageBox').val('');
	var userNameIndex=window.location.search.indexOf("username=");
	userNameIndex+=9; // offset pass username=
  myUserName = window.location.search.substr(userNameIndex);

	var message = new Message(myUserName, messageText, currentRoom);
	app.send(message);
	app.addMessage(message);
}

app.updateMessages = function(data) {
	if (data){
			for (var i = index; i < data.length; i++){
		  var message = new Message(data[i].username, data[i].text, data[i].roomname);
		  if (message.username !== myUserName){
		  	app.addMessage(message);
		  }
	  }
	}
}

app.changeRoom = function(roomName){
	$('#chats').find('.chat').addClass('invisible');
			$('#chats').find('.' + currentRoom).removeClass('invisible');
		if(currentRoom === 'Lobby'){
			$('#chats').find('.chat').removeClass('invisible');
		}
}

$(document).ready(function(){
	$('#main').on('click', '.username', function(event){
		var user = $(this).text();
		app.addFriend(user);
	});

	$('form').submit(function(event){
		// debugger;
		event.preventDefault();
		$('#messageBox').focus();
		var messageText = $(this).children('#messageBox').val();
		app.handleSubmit(messageText);
	});

	$('button').click('#addRoom', function(event){
		var newRoomName = prompt("Enter room name:");
		app.addRoom(newRoomName);
		app.changeRoom(newRoomName);
	});

	$('#roomSelect').change(function(event){
		currentRoom = $(this).val();
		app.changeRoom(currentRoom);
	})
});
app.init();
// app.send(message);


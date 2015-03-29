/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

These headers will allow Cross-Origin Resource Sharing (CORS).
This code allows this server to talk to websites that
are on different domains, for instance, your chat client.

Your chat client is running from a url like file://your/chat/client/index.html,
which is considered a different domain.

Another way to get around this restriction is to serve you chat
client from this domain by setting up static file serving.

.writeHead() writes to the request line and headers of the response,
which includes the status and all headers.
response.writeHead(statusCode, headers); // format: https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers

Make sure to always call response.end() - Node may not send
anything back to the client until you do. The string you pass to
response.end() will be the body of the response - i.e. what shows
up in the browser.

Calling .end "flushes" the response's internal buffer, forcing
node to actually send all the data over to the client.

**************************************************************/

var url = require('url');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/plain" // Tell the client we are sending them plain text. You will need to change this if you are sending something other than plain text, like JSON or HTML.
};

var obj = {
    results: [], // puts all messages here, regardless of chatroom
    room1: {
      results: []
    },
    room2: {
      results: []
    },
    Lobby: {
      results: []
    }
  };

// Request and Response come from node's http module.
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

exports.requestHandler = function(request, response) {


  //console.log("Serving request type " + request.method + " for url " + request.url);
//  console.log("GET REQUEST: ", request);
//  console.log("GET REPONSE: ", response);

  if (request.method === 'GET'){

    var queryData=url.parse(request.url, true);
    console.log("LOGS path: ", queryData.path);/// this will print
    if (queryData.path.slice(9) === "messages") {
      response.writeHead(200, headers);
      response.end(JSON.stringify(obj));
    } else if (!obj[queryData.path.slice(9)]) {
      console.log ('ROOM NOT FOUND');
      response.writeHead(404, headers);
      response.end();
    } else {
      response.writeHead(200, headers);
      response.end(JSON.stringify(obj[queryData.path.slice(9)]));
    }
  }

  if (request.method === 'POST'){
    //console.log(request.pathname);
    //var queryData=url.parse(request.url, true);
    //console.log("THIS IS THE URL PATHNAME: ", queryData);
    var requestBody = '';
    request.on('data', function(data) {
      requestBody += data;
      var queryPath=url.parse(request.url,true);
      //var pathobj = { pathname: queryPath};
      console.log("QUERYPATH: ", queryPath.path);
      requestBody['path'] = queryPath.path;
      console.log("REQUESTBBBODY: ", requestBody);
      obj.results.push(requestBody);
      var myPath=queryPath.path.slice(9);
      obj[myPath]["results"].push(requestBody);
      console.log("ENTIRE OBJ: ", obj);
    });

    response.writeHead(201, headers);
    response.end(JSON.stringify(obj));
  }

  if (request.method === 'OPTIONS'){
    //console.log(request.method);
    response.writeHead(200, headers);
    response.end(JSON.stringify(obj));
  }

  if (request.method === 'ERROR'){
    //console.log(request.method);
    response.writeHead(404, headers);
    response.end();
  }

};



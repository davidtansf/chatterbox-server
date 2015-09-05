// var exports = module.exports = {};

var data = {
  results: [
    {
      roomname: 'Node',
      username: 'David',
      text: 'Hello, World!!'
    }
  ]
};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/plain"
};

var routes = {
  '/classes/room1': true,
  '/classes/messages': true
};

exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var path = request.url;

  if (routes[path]) {

    if (request.method === 'OPTIONS') {

      response.writeHead(200, headers);
      response.end("OPTIONS CONFIRMED");

    }

    if (request.method === 'GET') {

      response.writeHead(200, headers);
      response.end(JSON.stringify(data));

    }

    if (request.method === 'POST') {

      var body = '';
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        data.results.push(JSON.parse(body));
        response.writeHead(201, headers);
        response.end(JSON.stringify(data));
      });

    }
  } else {

    response.writeHead(404, headers);
    response.end();

  }
};


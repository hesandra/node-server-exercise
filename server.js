var http = require('http');
var request = require('request');
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'POST') {
    // do chunking magic to get post data
    collectData(req, (data) => {
      data = JSON.parse(data);
      const userIds = data.userIds;
      console.log(userIds);

      getUserData(userIds, function(userNames) {
        // we have all 3 names here.
        res.writeHead(201, headers);
        res.end(JSON.stringify(userNames));
      });

      // res.writeHead(200, headers);
      // res.end(JSON.stringify({ hello: 'world' }));
    });
  }
  // POST { userIds: [1, 2, 3] }
  // write a route that responds with all 3 user's names

}).listen(8080, 'localhost');

var getUserData = function(userIds, callback) {
  var userData = [];
  var count = 0;

  request(`https://jsonplaceholder.typicode.com/users/${userIds[0]}`, function (error, response, body) {
    const name = JSON.parse(body).name;
    userData[0] = name;
    count++;
    if (count === 3) {
      callback(userData);
    }
  });

  request(`https://jsonplaceholder.typicode.com/users/${userIds[1]}`, function (error, response, body) {
    const name = JSON.parse(body).name;
    userData[1] = name;
    count++;
    if (count === 3) {
      callback(userData);
    }
  });

  request(`https://jsonplaceholder.typicode.com/users/${userIds[2]}`, function (error, response, body) {
    const name = JSON.parse(body).name;
    userData[2] = name;
    count++;
    if (count === 3) {
      callback(userData);
    }
  });
};

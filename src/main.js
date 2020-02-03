var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    if(request.url === '/'){
        request.url = '/index.html';
    }
    
    fs.readFile('./' + request.url, function(err, data) {
        if (err) {
            response.writeHead(404, 'Not Found');
            response.end();
        } else {
            var dotoffset = request.url.lastIndexOf('.');
            var mimetype = dotoffset == -1 ? 'text/plain' : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript',
                                '.svg' : 'image/svg+xml'
                                }[ request.url.substr(dotoffset) ];
            response.setHeader('Content-type' , mimetype);
            response.end(data);
        }
    });
}).listen(8888);
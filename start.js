/**
 * Created by linhehe on 15/7/25.
 */
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Your Project Succeed Start...')
    res.end();
}).listen(3000);

console.log('Your Project Succeed Start...');
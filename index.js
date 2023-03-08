const net = require('net');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = new URL(req.url, 'http://localhost');
        const subText = url.searchParams.get('sub-text');//.trim();
        let secondarySubText = url.searchParams.get('secondary-sub-text');//.trim()
        if (subText && subText !== "undefined") {
            if (secondarySubText === "undefined") secondarySubText = null;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({subText, secondarySubText}));
                }
            });
            res.end('Message relayed via WebSocket\n');
        } else {
            res.end('No message provided\n');
        }
    } else {
        res.end('Hello World\n');
    }
});

const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
/* wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
*/

const tester = net.createServer();

tester.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Port 21659 is already in use');
    }
});

tester.once('listening', () => {
    tester.close();
    console.log('Port 21659 is available');
    server.listen(21659, () => {
        console.log('Server listening on port 21659');
    });
});

tester.listen(21659)
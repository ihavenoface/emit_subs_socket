// ==UserScript==
// @name        Insert from websocket
// @namespace   Violentmonkey Scripts
// @match       https://learnjapanese.moe/texthooker.html
// @grant       none
// @version     1.0
// @author      noface
// ==/UserScript==

(() => {
    'use strict';
    let socket;

    function connect() {
        socket = new WebSocket('ws://localhost:21659');

        socket.addEventListener('open', () => {
            console.log('WebSocket connection established');
        });

        let debounce;

        socket.addEventListener('message', (event) => {
            // console.log(`Received message: ${event.data}`);
            if (!event) return
            const data = JSON.parse(event.data).subText
            if (data.length === 0 || data === "undefined" || debounce === data) return
            debounce = data
            const el = Object.assign(document.createElement('p'), { textContent: data });
            document.body.appendChild(el)
        });

        socket.addEventListener('error', () => {
            console.log('WebSocket connection error');
            setTimeout(connect, 1000); // attempt to reconnect after a delay
        });

        socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            setTimeout(connect, 1000); // attempt to reconnect after a delay
        });
    }

    connect();
})()

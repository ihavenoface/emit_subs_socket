var HttpClient = require('./mpv-javascript-http/HttpClient');
var http = new HttpClient();
if (!HttpClient.available) {
    msg.error('HTTP client unavailable!');
    exit();
}

var arguments2array = function arguments2array(args) {
    return [].slice.call(args).filter(function(v) { return v !== undefined; });
};

var subprocess = function subprocess() {
    return mp.command_native({
        name: 'subprocess',
        args: arguments2array(arguments),
        playback_only: false,
        capture_stdout: true,
        capture_stderr: true,
    });
};

/**
 * @returns {string|undefined}
 */
var detect_os = function detect_os() {
    var home = mp.utils.getenv('USERPROFILE');
    if (typeof home === 'string' && /^[A-Z]:|^\\\\/i.test(home)) {
        return 'windows';
    }
    var process = subprocess('uname', '-s');
    if (process.status === 0) {
        var os = process.stdout.trim();
        if (os === 'Linux') {
            return 'linux';
        }
        if (os === 'Darwin') {
            return 'macos';
        }
    }
    return undefined;
};

var OS = detect_os();

/**
 * @returns {string|undefined}
 */
var detect_node = function detect_node() {
    var process;
    var result = '';
    if (OS === 'windows') {
        process = subprocess('where.exe', 'node.exe');
        if (process.status === 0) {
            result = process.stdout.split('\n')[0].trim();
        }
    } else {
        process = subprocess('sh', '-c', 'command -p -v node');
        if (process.status === 0) {
            result = process.stdout.trim();
        }
    }
    return result === '' ? undefined : result;
};

var NODE = detect_node();

function runSocket () {
    var command_opts = [
        '-e',
        'const net=require("net"),http=require("http"),WebSocket=require("ws"),server=http.createServer((e,r)=>{if("GET"===e.method){const s=new URL(e.url,"http://localhost"),n=s.searchParams.get("sub-text"),t=s.searchParams.get("time");let o=s.searchParams.get("secondary-sub-text");n&&"undefined"!==n?("undefined"===o&&(o=null),wss.clients.forEach(e=>{e.readyState===WebSocket.OPEN&&e.send(JSON.stringify({subText:n,secondarySubText:o,timePos:t}))}),r.end("Message relayed via WebSocket\\n")):r.end("No message provided\\n")}else r.end("Hello World\\n")}),wss=new WebSocket.Server({server:server}),ensureServerIsRunning=e=>{const r=net.createServer();r.once("error",r=>{"EADDRINUSE"===r.code&&e&&console.log("Port 21659 is already in use")}),r.once("listening",()=>{r.close(),e&&console.log("Port 21659 is available"),server.listen(21659,()=>{e&&console.log("Server listening on port 21659")})}),r.listen(21659)};ensureServerIsRunning(!0),setInterval(()=>{ensureServerIsRunning(!1)},1e3);'
    ]
    var process = mp.command_native_async({
        name: 'subprocess',
        args: [NODE].concat(command_opts),
    });
    return {
        abort: mp.abort_async_command.bind(this, process),
    }
}

function onLoadHook () {
    runSocket()
    mp.observe_property("sub-text", "string", function () {
        var query = '?sub-text=';
        query += encodeURIComponent(mp.get_property("sub-text"));
        query += '&secondary-sub-text=';
        query += encodeURIComponent(mp.get_property("secondary-sub-text"));
        query += '&time='
        query += encodeURIComponent(mp.get_property_native("time-pos"));
        http.get('http://localhost:21659/' + query, function (err ) {
            if (err) {
                mp.msg.error(err);
            }
        });
    });

}
mp.add_hook('on_load', 50, onLoadHook);
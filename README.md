## emit_subs_socket for mpv

<blockquote>
Tired of constantly using your clipboard to read and write subtitles? Switch to emit_subs and enjoy a more efficient 
solution. Our innovative technology uses websockets to publish subtitles, freeing up your clipboard for other tasks.
No more frustration and wasted time switching back and forth between your media player and subtitle source.
With emit_subs, you can seamlessly integrate and enjoy a smoother workflow. Give it a try today and see the difference
for yourself!  

<cite>ChatGPT</cite>
</blockquote>


*mpv displays sub -> http get -> websocket -> (your application)*

Pre-requites:
- node
- curl

Tested on windows. Might work elsewhere.

```bat
cd %appdata%\mpv\scripts
git clone https://github.com/ihavenoface/emit_subs_socket.git
cd emit_subs_socket
git submodule update --init --recursive
```

In the browser [example.user.js](example.user.js) can be used on the receiving end.  
A userscript manager [like violentmonkey](https://violentmonkey.github.io/) is needed to run it.

# licode-streams-mix
Mixes remote streams form media room in the browser
It uses  implementation of the mixer from 
https://github.com/t-mullen/video-stream-merger

The idea is to merge remote streams by using VideoStreamMerger functionality,
draw it on 1 canvas, from which get resulting frames by setting timeout
every 16ms ( to get around 60 fps).
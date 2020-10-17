/* globals Erizo */

/* eslint-env browser */
/* eslint-disable no-param-reassign, no-console */
// This version uses getVideoFrame(0 from remote streams, which is
// very slow.
const serverUrl = '/';
let localStream;
let room;
let audio_track;

//added to test getVideoFrame API
let bitmap;
//var canvas = document.createElement('canvas');
//var context = canvas.getContext('2d');
//canvas.id = "testCanvas";
//document.body.appendChild(canvas);
var global_streams = new Object();

function printText(text) {
  document.getElementById('messages').value += `- ${text}\n`;
}

window.onload = () => {
  const config = { audio: true, video: true, data: true, videoSize: [640, 480, 640, 480] };
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.id = "testCanvas";
  document.body.appendChild(canvas);
  setInterval(function() {
      bitmap = null;
      for(var id in global_streams){
	  var curr_stream = global_streams[id];
          var start = performance.now();
	        bitmap = curr_stream.getVideoFrame();
          var end = performance.now();
          printText('Took frame in '+ (end-start));
          if (bitmap !== null ){
          printText('Frame from stream '+ id +' has width :' + bitmap.width);
          context.putImageData(bitmap,0,0);
          }
       }
     // if (global_streams.length > 1){

     // bitmap = global_streams[1].getVideoFrame();

     // canvas.width = bitmap.width;
     // canvas.height = bitmap.height;

     // context.putImageData(bitmap, 0, 0);
     // }

    }, 100);


  localStream = Erizo.Stream(config);
  const createToken = (userName, role, callback) => {
    const req = new XMLHttpRequest();
    const url = `${serverUrl}createToken/`;
    const body = { username: userName, role };

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        callback(req.responseText);
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
  };

  createToken('user', 'presenter', (response) => {
    const token = response;
    console.log(token);
    room = Erizo.Room({ token });

    localStream.addEventListener('access-accepted', () => {
      printText('Mic and Cam OK');
      const subscribeToStreams = (streams) => {
        streams.forEach((stream) => {
          room.subscribe(stream);
        });
      };

      room.addEventListener('room-connected', () => {
        printText('Connected to the room OK');
        room.publish(localStream, { maxVideoBW: 300 });
      });

      room.addEventListener('stream-subscribed', (streamEvent) => {
        printText('Subscribed to  streamID:'+streamEvent.stream.getID()+ ' local: '+ streamEvent.stream.local);
        const stream = streamEvent.stream;
        stream.show('my_subscribed_video');
        //const m_stream = stream.stream;
	//audio_track = m_stream.getAudioTracks();
	//if (audio_track !== undefined){
	//printText('Audio track discovered!');
	//setInterval(function(){
		//printText('Content of audio_track:');
		/*printText(audio_track.toString());*/
		//},100
	  //);
	//}
      });

      room.addEventListener('stream-added', (streamEvent) => {
        //printText('Local stream published OK');
        printText('stream added with streamID:' + streamEvent.stream.getID() + ' local: '+ streamEvent.stream.local  );
        const streams = [];
	    global_streams[streamEvent.stream.getID()] = streamEvent.stream;
        streams.push(streamEvent.stream);
        subscribeToStreams(streams);
      });

      room.addEventListener('stream-removed', (streamEvent) => {
        // Remove stream from DOM
        const stream = streamEvent.stream;
        if (stream.elementID !== undefined) {
          const element = document.getElementById(stream.elementID);
	      delete global_streams[stream.getID()];
          document.body.removeChild(element);
        }
      });

      room.addEventListener('stream-failed', () => {
        console.log('STREAM FAILED, DISCONNECTION');
        printText('STREAM FAILED, DISCONNECTION');
        room.disconnect();
      });

      room.connect();

      localStream.show('my_local_video');
    });
    localStream.init();
  });
};

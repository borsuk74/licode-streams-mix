/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
// Working example, adapted from webrtc-samples github.
'use strict';

// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;


var processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 16); // roughly 60 frames per second
  },

  doLoad: function() {
    this.video = video;//document.getElementById("video");
    this.c1 = window.canvas;//document.getElementById("canvas");
    this.ctx1 = this.c1.getContext("2d");
    var self = this;
    this.width = canvas.width;
    this.height = canvas.height;//this.video.scrollHeight;
    self.timerCallback();
    //this.video.addEventListener("play", function() {
      //self.width = self.video.width;
      //self.height = self.video.height;
      //self.timerCallback();
    //}, false);
  },

  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    //var l = frame.data.length / 4;

    //for (var i = 0; i < l; i++) {
      //var grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

      //frame.data[i * 4 + 0] = grey;
      //frame.data[i * 4 + 1] = grey;
      //frame.data[i * 4 + 2] = grey;
    //}
    //this.ctx1.putImageData(frame, 0, 0);

    return;
  }
};


const button = document.querySelector('button');
button.onclick = function() {
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  //canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	processor.doLoad();
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
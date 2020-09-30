const ipcRenderer = require('electron').ipcRenderer;

/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

ipcRenderer.on('info', function (event, data) { console.log(data.msg) });

ipcRenderer.on('info2', function (event, data) {
  document.body.classList.add("got-access");
  document.body.classList.remove("asking-access");
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      console.log(stream);
      var audioContext = new AudioContext();
      var analyser = audioContext.createAnalyser();
      var microphone = audioContext.createMediaStreamSource(stream);
      var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      javascriptNode.onaudioprocess = function () {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
          values += (array[i]);
        }

        var average = values / length;

        if (values > 20000) {
          document.body.classList.add("high-warning");
        } else {
          document.body.classList.remove("high-warning");
        }
      }
    })
    .catch(function (err) {
      /* handle the error */
    });

  // });
});
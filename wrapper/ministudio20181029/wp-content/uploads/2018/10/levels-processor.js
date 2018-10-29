

class LevelMeteringProcessor extends AudioWorkletProcessor {

  process(inputs, outputs, params) {
    let peaks = inputs[0].map(peak);
    let rmss = inputs[0].map(rms);
    this.port.postMessage({ peaks, rmss });
    return true;
  }

}


function peak(data) {
  let max = 0;
  let len = data.length;
  for (let n = 0; n < len; n++) {
    let x = data[n];
    if (x < 0) x = -x;
    if (x > max) max = x;
  }
  return max;
}


function rms(data) {
  let s = 0;
  let len = data.length;
  for (let n = 0; n < len; n++) {
    let x = data[n];
    s += x * x;
  }
  return Math.sqrt(s / len);
}


registerProcessor("LevelMeteringNode", LevelMeteringProcessor);

if (process.argv.length != 6) {
	console.log("usage: node convert.js modulename wasmfilename webfolder hexkey");
	return;
}
var modulename = process.argv[2];
var wasmfilename = process.argv[3];
var webfolder = process.argv[4];
var hexkey = process.argv[5];
//let wasmName = process.argv[2];
//let name = wasmName.substr(0, wasmName.length - 5).toUpperCase();
fs = require('fs');
//let wasmData = fs.readFileSync(wasmName);
var wasmData = fs.readFileSync(wasmfilename);
let wasmStr = wasmData.join(",");
let wasmOut = "AudioWorkletGlobalScope.WAM = AudioWorkletGlobalScope.WAM || {}\n";
//wasmOut += "AudioWorkletGlobalScope.WAM." + name + " = { ENVIRONMENT: 'WEB' }\n";
//wasmOut += "AudioWorkletGlobalScope.WAM." + name + ".wasmBinary = new Uint8Array([" + wasmStr + "]);";
wasmOut += "AudioWorkletGlobalScope.WAM." + modulename + " = { ENVIRONMENT: 'WEB' }\n";
wasmOut += "AudioWorkletGlobalScope.WAM." + modulename + ".wasmBinary = new Uint8Array([" + wasmStr + "]);";
//fs.writeFileSync(wasmName + ".js", wasmOut);
fs.writeFileSync(wasmfilename + ".js", wasmOut);
var txt = fs.readFileSync(webfolder + '/index.js').toString();
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename);
fs.writeFileSync(webfolder + '/index.js', txt);
txt = fs.readFileSync(webfolder + '/processormodule.js').toString();
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename);
txt = txt.replace(new RegExp('HEXPLUGINKEY', 'gi'), hexkey);
fs.writeFileSync(webfolder + '/processormodule.js', txt);

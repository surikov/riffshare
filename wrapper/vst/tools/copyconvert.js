if (process.argv.length != 7) {
	console.log("usage: node copyconvert.js modulename wasmfilename webfolder hexkey subname");
	return;
}
var modulename = process.argv[2];
var wasmfilename = process.argv[3];
var webfolder = process.argv[4];
var hexkey = process.argv[5];
var subname = process.argv[6];
fs = require('fs');

var wasmStr = fs.readFileSync(wasmfilename);
wasmStr = wasmStr.join(",");
var txt = "AudioWorkletGlobalScope.WAM = AudioWorkletGlobalScope.WAM || {}\n";
txt = txt + "AudioWorkletGlobalScope.WAM." + modulename + " = { ENVIRONMENT: 'WEB' }\n";
txt = txt + "AudioWorkletGlobalScope.WAM." + modulename + ".wasmBinary = new Uint8Array([" + wasmStr + "]);";
fs.writeFileSync(wasmfilename + ".js", txt);

txt = fs.readFileSync(webfolder + '/' + modulename + '.js').toString();
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename);
fs.writeFileSync(webfolder + '/' + modulename + '.js', txt);

txt = fs.readFileSync(webfolder + '/' + modulename + '.' + subname + '.processor.js').toString();
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename);
txt = txt.replace(new RegExp('HEXPLUGINKEY', 'gi'), hexkey);
fs.writeFileSync(webfolder + '/' + modulename + '.' + subname + '.processor.js', txt);

txt = fs.readFileSync(webfolder + '/' + modulename + '.' + subname + '.lib.js').toString();
txt = txt.replace(new RegExp('VSTMODULENAME.processor.js', 'gi'), modulename + '.' + subname + '.processor.js');
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename);
fs.writeFileSync(webfolder + '/' + modulename + '.' + subname + '.lib.js', txt);

txt = fs.readFileSync(webfolder + '/' + modulename + '.' + subname + '.html').toString();
txt = txt.replace(new RegExp('VSTMODULENAME', 'gi'), modulename + '.' + subname);
fs.writeFileSync(webfolder + '/' + modulename + '.' + subname + '.html', txt);

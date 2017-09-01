function saveObject2localStorage(name, o) {
	console.log('saveObject2localStorage', name, o);
	localStorage.setItem(name, JSON.stringify(o));
}
function readObjectFromlocalStorage(name) {
	var o = null;
	try {
		o = JSON.parse(localStorage.getItem(name));
	} catch (ex) {
		console.log(ex);
		return {};
	}
	return o;
}
function saveText2localStorage(name, text) {
	console.log('saveText2localStorage', name, text);
	localStorage.setItem(name, text);
}
function readTextFromlocalStorage(name) {
	var o = '';
	try {
		o = localStorage.getItem(name);
	} catch (ex) {
		console.log(ex);
	}
	return o;
}
function sureNumeric(v, minValue, defaultValue, maxValue) {
	var r = defaultValue;
	try {
		r = Number.parseFloat(v);
	} catch (ex) {
		console.log(ex);
	}
	if (isNaN(r)) {
		r = defaultValue;
	}
	if (r < minValue) {
		r = minValue;
	}
	if (r > maxValue) {
		r = maxValue;
	}
	return r;
}
function sureInList(v, defaultValue, items) {
	var r = defaultValue;
	for (var i = 0; i < items.length; i++) {
		if (items[i] == v) {
			return v;
		}
	}
	return r;
}
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
	return vars;
}

var fs = require('fs');
var path = require('path');
var async = require('async'); // https://github.com/caolan/async

// Original function
function getDirsSync(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var basepath = './gfx/';
var dirlist = getDirsSync('./gfx/');

function listfiles(testFolder) {
	dirlist.forEach(dir => {
		fs.readdir(testFolder+dir+'/', (err, files) => {
			let output = dir + ' = [';
			var counter = 0;
			files.forEach(file => {
				if (file != "removed") output += (counter?',':'') + '\''+file+'\'';
				counter++;
			});
		    output += '];'
			console.log(output);
		});
	});
}

listfiles(basepath);

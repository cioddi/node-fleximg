var im = require('imagemagick');
var fs = require('fs');

var fleximg = function(reqPath,next){
	console.log(reqPath);

	// analyze url
	var url_parts = reqPath.split('/');
	var width = url_parts[2];
	var height = url_parts[3];

	url_parts.splice(0,4);
	var path = url_parts.join('/');

	console.log('width: ' + width);
	console.log('height: ' + height);
	console.log('path: ' + path);

	var convert_image = function(callback){
		im.convert(['img/' + path, '-resize', width, 'img' + reqPath],
			function(err, stdout){
				console.log(stdout);
				console.log(err);
				if(typeof callback === 'function')callback();
			});
	};

	var create_width_folder = function(callback){
		create_folder('img/imagecache/' + width,callback);
	};

	var create_height_folder = function(callback){
		create_folder('img/imagecache/' + width + '/' + height,callback);
	};

	var create_folder = function(folder,callback){
		fs.lstat(folder, function(err, stats) {
			if (!err && stats.isDirectory()) {
				if(typeof callback === 'function')callback();
			}else{
				fs.mkdir(folder,function(err,stats){
					if(typeof callback === 'function')callback();
				});
			}
		});
	};
	
	create_width_folder(function(){
		create_height_folder(function(){
			convert_image(function(){
				next();
			});
		});
	});
};

exports = module.exports = function() {
	return function(req, res, next) {
		
		if(req.path.indexOf('/imagecache/') !== -1){
			
			fs.lstat(req.path, function(err, stats) {
				if (!err && stats.isDirectory()) {
					next();
				}else{
					fleximg(req.path,next);
				}
			});
		}
	};
};
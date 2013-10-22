var im = require('imagemagick');
var fs = require('fs');

var fleximg = function(reqPath,options,next){
	if(!next){
		next = options;
		options = {};
	}
	var targetPath = null;
	var targetWidth = null;
	var targetHeight = null;
	var originalPath = null;

	var analyzeUrl = function(){

		targetPath = reqPath;
		var url_parts = reqPath.split('/');
		targetWidth = url_parts[2];
		targetHeight = url_parts[3];

		url_parts.splice(0,4);
		
		originalPath = url_parts.join('/');
	};

	var getDefaultOptions = function(){
		return {
			steps: 50,
			jpeg_compression: 90,
			use_gdlib: false,
			debug: false
		};
	};

	var analyzeImage = function(callback){

		if(typeof callback === 'function')callback();
	};

	var convert_image = function(callback){
		im.convert(['img/' + originalPath, '-resize', targetWidth, 'img' + targetPath],
			function(err, stdout){
				console.log(stdout);
				console.log(err);
				if(typeof callback === 'function')callback();
			});
	};

	var create_width_folder = function(callback){
		create_folder('img/imagecache/' + targetWidth,callback);
	};

	var create_height_folder = function(callback){
		create_folder('img/imagecache/' + targetWidth + '/' + targetHeight,callback);
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

	var debug_messages = function(){

		console.log('width: ' + targetWidth);
		console.log('height: ' + targetHeight);
		console.log('path: ' + path);

	};

	var applyOptions = function(applyoptions){
		for (var key in applyoptions) {
			if(!options.hasOwnProperty(key)){
				options[key] = applyoptions[key];
			}
		}
	};

	var init = function(){
		applyOptions(getDefaultOptions());

		analyzeUrl();

		analyzeImage(function(){
			create_width_folder(function(){
				create_height_folder(function(){
					convert_image(function(){
						next();
					});
				});
			});
		});
		
	};
	
	init();
};

exports = module.exports = function(options) {

	return function(req, res, next) {
		
		if(req.path.indexOf('/imagecache/') !== -1){
			
			fs.lstat(req.path, function(err, stats) {
				console.log(err);

				if (!err && stats.isDirectory()) {
					next();
				}else{
					fleximg(req.path,next);
				}
			});
		}
	};
};
var im = require('imagemagick');
var fs = require('fs');

var imagecache_path = 'imagecache';
// var rewritePath = function(){};

var fleximg = function(reqPath,options,next){
	if(!next){
		next = options;
		options = {};
	}
	var targetPath = null;
	var targetWidth = null;
	var targetHeight = null;
	var targetPathWidth = null;
	var targetPathHeight = null;
	var originalPath = null;
	var originalWidth = null;
	var originalHeight = null;
	var originalCompression = null;
	var ratio = null;

	var fitValueToSteps = function(value){
		value = parseInt(value,10);
		var rest = value % options.steps;

		if(rest){
			value = value+(options.steps-rest);
		}
		return value;
	};

	var calculateMissingDimension = function(){
		if(targetHeight === '0'){

			targetWidth = fitValueToSteps(targetWidth);
			console.log(targetWidth);
			targetPathWidth = targetWidth;
			targetPathHeight = '0';
			ratio = targetWidth/originalWidth;
			targetHeight = parseInt(ratio*originalHeight,10);
		}else if(targetWidth === '0'){

			targetHeight = fitValueToSteps(targetHeight);
			console.log(targetHeight);
			targetPathWidth = '0';
			targetPathHeight = targetHeight;
			ratio = targetHeight/originalHeight;
			targetWidth = parseInt(ratio*originalWidth,10);
		}
	};

	var analyzeUrl = function(){

		targetPath = reqPath;
		var url_parts = reqPath.split('/');
		targetWidth = url_parts[2];
		targetHeight = url_parts[3];

		url_parts.splice(0,4);
		
		originalPath = 'img/' + url_parts.join('/');
	};

	var adjustUrl = function(){
		targetPath_parts = targetPath.split('/');
		if(targetPath_parts[1] === imagecache_path){
			targetPath_parts[2] = targetPathWidth;
			targetPath_parts[3] = targetPathHeight;
		}
		targetPath = targetPath_parts.join('/');
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
		console.log(originalPath);
		im.identify(originalPath,function(err,meta){

			// console.log(meta);
			originalWidth = meta.width;
			originalHeight = meta.height;
			originalCompression = meta.compression;
			if(typeof callback === 'function')callback();
		});
	};

	var convert_image = function(callback){
		console.log(originalPath);
		im.convert([originalPath, '-resize', targetWidth + 'x' + targetHeight, 'img' + targetPath],
			function(err, stdout){
				if(typeof callback === 'function')callback();
			});
	};

	var create_width_folder = function(callback){
		create_folder('img/imagecache/' + targetPathWidth,callback);
	};

	var create_height_folder = function(callback){
		create_folder('img/imagecache/' + targetPathWidth + '/' + targetPathHeight,callback);
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

	var file_exists = function(path,yes,no){
		fs.lstat(path, function(err, stats) {

				console.log(path);
			if (!err && stats.isFile()) {
				if(typeof yes === 'function')yes();
			}else{
				if(typeof no === 'function')no();
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

			calculateMissingDimension();
			
			adjustUrl();
			rewritePath(targetPath);

			file_exists('img' + targetPath,function(){
				next();
			},function(){

				create_width_folder(function(){
			
					create_height_folder(function(){
				
						convert_image(function(){
							next();
						});
					});
				});
			});
			
		});
		
	};
	
	init();
};

exports = module.exports = function(options) {

	return function(req, res, next) {
		
		if(req.path.indexOf('/' + imagecache_path + '/') !== -1){
			
			fs.lstat('img' + req.path, function(err, stats) {

				rewritePath = function(targetpath) {
					req.url = targetpath;
					req.originalUrl = targetpath;
				};

				if (!err && stats.isDirectory()) {
					next();
				}else{
					fleximg(req.path,next);
				}
			});
		}
	};
};
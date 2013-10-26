var im = require('imagemagick');
var fs = require('fs');

var imagecache_path = 'imagecache';

var fleximg = function(reqPath,options,next){
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
	var nested_folders = null;
	var growingPath = 'img/';

	if(!next){
		next = options;
		options = {};
	}

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

			targetPathWidth = targetWidth;
			targetPathHeight = '0';
			ratio = targetWidth/originalWidth;
			targetHeight = parseInt(ratio*originalHeight,10);
		}else if(targetWidth === '0'){

			targetHeight = fitValueToSteps(targetHeight);

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

		nested_folders = JSON.parse(JSON.stringify(url_parts));
		//remove filename
		nested_folders.splice(-1);
		//remove imagecache folder name
		nested_folders.splice(0,1);

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
			max_folder_nesting:50
		};
	};

	var analyzeImage = function(callback){

		im.identify(originalPath,function(err,meta){

			// console.log(meta);
			originalWidth = meta.width;
			originalHeight = meta.height;
			originalCompression = meta.compression;
			if(typeof callback === 'function')callback();
		});
	};

	var convert_image = function(callback){
		im.resize({
			srcPath:	originalPath,
			dstPath:	'img' + targetPath,
			width:		targetWidth,
			height:		targetHeight,
			quality:	options.jpeg_compression*0.01,
		},function(err, stdout){
				if(typeof callback === 'function')callback();
			});
	};

	// create folders from nested_folders[] under /img
	var create_nested_folders = function(callback){

		var current = nested_folders.splice(0,1);
		growingPath += '/' + current;

		var nextStep = function(){
			if(nested_folders.length === 0){
				if(typeof callback === 'function')callback();
			}else{
				create_nested_folders(callback);
			}
			
		};

		if(nested_folders){
			fs.lstat(growingPath, function(err, stats) {
				if (!err && stats.isDirectory()) {
					nextStep();
				}else{
					fs.mkdir(growingPath,function(err,stats){
						nextStep();
					});
				}
			});
		}
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
			if (!err && stats.isFile()) {
				if(typeof yes === 'function')yes();
			}else{
				if(typeof no === 'function')no();
			}
		});
	};

	var applyOptions = function(applyoptions){
		for (var key in applyoptions) {
			if(!options.hasOwnProperty(key)){
				options[key] = applyoptions[key];
			}
		}
	};

	var urlValid = function(){
		var url_parts = reqPath.split('/');
		var valid = true;

		if(url_parts[0] === imagecache_path)valid = false;

		if((url_parts.length-3) > options.max_folder_nesting)valid = false;

		return valid;
	};

	var init = function(){
		file_exists('img' + reqPath,function(){
			// if file exists
			next();
		},function(){
			applyOptions(getDefaultOptions());

			
			if(urlValid()){

				analyzeUrl();

				analyzeImage(function(){

					calculateMissingDimension();
					
					adjustUrl();

					rewritePath(targetPath);

					file_exists('img' + targetPath,function(){
						// if file exists
						next();
					},function(){
						// if file does not exists
						
						create_nested_folders(function(){

							convert_image(function(){
								next();
							});

						});
					});

				});
			}
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
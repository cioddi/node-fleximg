#node-fleximg

Responsive image loader - Automatically resizes image files to fit the desired display dimensions

**not ready for production use**

##Website
http://www.fleximg.com

##What

###Client

```
collect all img tags that have "data-src" attribute set
each
	measure desired display dimensions
	set the source of that img tag to a path that leads to the resized image

```

###Server
```
catch the request for that image file
	if not image_file_exists
		create a resized version of the original image
	
	deliver it
```

#amazon ec2 setup

##debian based distros

- setup your ubuntu ec2 instance in amazon aws console
- create a new security group to allow incoming connections on port 8080
- ```sudo apt-get install -y git```
- ```git clone https://github.com/cioddi/node-fleximg.git```
- ```cd node-fleximg```
- ```./server_test_setup.sh```
- start the fleximg node server using ```node index```

##MIT license
Copyright (c) 2013 Max Tobias Weber


##additional copyright info
###assets
img/test.jpg (2013 Loren Kerns http://www.flickr.com/photos/lorenkerns/9262656978/)
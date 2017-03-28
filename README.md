Partm is a package manager for CAD files. We wish to create an open source format that companies could adopt to share their CAD data / products with designers, creators and builders. 

Why
---
Software designers have been using package manager for a long time, now mechanical engineers can do the same! The proces of getting the right CAD files can be very time consuming. Searching for the right STEP files, downloading the datasheets, finding a good location to store them on your local drive, getting to know where you can buy it, request the price, check what the dimensions or weight is etc. Image doing this many times over, with partm you can do all this with one console command.

Not only will this save you time but imagine what other applications can be created with this open source database. Companies that are willing to share their product information would greatly benefit from a system like this. They keep full control of their repository, can easily add new parts, or update their part information.

Installation
---
1. Download and install nodejs with npm (https://nodejs.org/en/)
2. Run 
---
	npm i -g https://github.com/jellehak/partm.git

Web
---
To test and view parts you can use this link: https://partm.herokuapp.com/#/search 
(Work in progress - At the moment you can only view the partm json files)


Usage
---
To install a single part run:

	partm install https://raw.githubusercontent.com/jellehak/partm-hammond-sample/master/1455D602.json

To install a full package run: (not working yet)

	partm install https://github.com/jellehak/partlib-hammond-sample.git

If you wish to create a project and save the package used, then run:
	
	partm init

To save a CAD part in your project run:
	
	partm install -s https://github.com/jellehak/partlib-hammond-sample.git


Supported instructions
---
	install <part.json>						Downloads the part files to the components/<partname>/* directory
	init (not implemented yet)				Creates a new project to keep track of the used components
	version <name> (not implemented yet)	Get the parts version
	remove <name> (not implemented yet)		Removes a part
	list (not implemented yet)				Lists all used parts
	help (not implemented yet)				Lists the availible commands
	register (not implemented yet)			Register a respository to the global registery

	Options
	-force	Force the download process


Creations of a respository
---
Bare method
1. Copy the part schema example file for each part. 
2. Upload this to a/your server
3. Make people aware they can use partm install <***.json> calls

Version control method
Tip: Get a good git editor like Visual Studio Code or github desktop. 
1. Create a new respository on a host like github 
2. Add one or multiple <partname>.json files
3. Add a package.json file referencing all your parts (optional)
4. Run (partm register <*.git>) to add it to the global registery


Part scheme
---
The part scheme is the core of the system, it is heavily based on the node package.json scheme more information can be found on: https://docs.npmjs.com/files/package.json.

The most important is the name and the files array. These fields instruct the cli app what to download. (For the moment the files array can only contain remote files. Later also files from the respository)

A file object consist of the following fields:

	type = "datasheet","image","step"
	url = the file location
	skip = true/false (if true it will skip this file to download)
	extract = true/false (if true || array the resource will be extracted)

Example scheme:

	{
		"name":"hammond-1455D602",
		"version": "1.0.0",
		"title":"Hammond Enclosure 1455D602",
		"description":"Extruded alu enclosure - DESIGNED FOR 39MM WIDE PC BOARD",
		"partnumber":"1455D602",
		"derivedparts":["1455D602","1455D602BK"],
		"units":"metric",
		"dimensions":{"length":60,"width":45,"height":25,"units":"mm"},
		"weight":0.1,
		"website":"http://www.hammondmfg.com/1455V2.htm",
		"vendors":[
			{"company":{"name":"Reichelt","website":"https://www.reichelt.nl","location":"DE"},"price":9.05,"deliverytime":{"mindays":1,"maxdays":2,"desc":"1-2 days"},"link":"https://www.reichelt.nl/Hammond-Aluminum-Enclosures/1455B1202BK/3/index.html?ACTION=3&LA=446&ARTICLE=121067&GROUPID=7732&artnr=1455B1202BK&SEARCH=alu%2Bcasing"}
		],
		"files":[
			{"type":"datasheet","url":"http://www.hammondmfg.com/pdf/1455D602.pdf"},
			{"type":"image","url":"http://www.hammondmfg.com/jpeg2/1455P1602_A2_B.jpg"},
			{"type":"step","skip":true,"extract":true,"url":"http://www.hammondmfg.com/3DZip/1455D602.zip"},
			{"type":"step","extract":["1455D602.stp"],"url":"http://www.hammondmfg.com/3DZip/1455D602.zip"}
		]
	}


Package scheme (optional)
---
The package scheme links all individual part schemes together, think of it as a collection of parts.

	{
		"name":"hammond-enclosures-sample",
		"version": "1.0.0",
		"title":"Hammond Enclosures package",
		"description":"Several Extruded alu enclosures",
		"website":"http://www.hammondmfg.com",
		"category":"enclosures",
		"tags":["enclosures","alu",""],
		"files":[
			"1455D602.json","1455D802.json"
		]
	}

Partm is a package manager for CAD files. We wish to create an open source format that companies could adopt to share their CAD data / products with designers, creators and builders. 

Software designers have been using package manager for a long time, now mechanical engineers can do the same!

With the benefit of hosting the files on git changes/updates/new products can easily be push/pulled.

Image what cool apps can grow on a structured open source database with many CAD data.

This meta information can be used with your inventory or stock software.

We hope that companies will adopt this format in the near future so great apps can be build on top of this structured database.

Installation
---
1. Download and install nodejs with npm (https://nodejs.org/en/)
2. Run
	
	npm i -g https://github.com/jellehak/partmanager.git


Usage
---
The global partm console app has the following instructions (simular to other packaging managers)

	partm install <*.git>
	partm init <*.git>
	partm update <*.git>
	partm init <*.git>

To install a single part run:

	partm install https://raw.githubusercontent.com/jellehak/partm-hammond-sample/master/1455D602.json

To install a full package run:

	partm install https://github.com/jellehak/partlib-hammond-sample.git

If you wish to create a project and save the package used, then run:
	
	partm init

To save a CAD part in your project run:
	
	partm install -s https://github.com/jellehak/partlib-hammond-sample.git


How it works
---
Each respository should look like this:

A package.json file descriping the library
Seperate *.json files referered by the package.json descripting each part ()


Part scheme
---
The scheme is based on the node package.json scheme more information can be found on: https://docs.npmjs.com/files/package.json.

The most important is the name and the files array. These fields instruct the cli app what to download. (For the moment the files array can only contain remote files.)
The file array consist of the following fields:
type = "datasheet","image","step"
url = the file location
skip = true/false (if true it will skip this file to download)
extract = true/false (if true || array the resource will be extracted)

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

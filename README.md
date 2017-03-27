This project is here to create an open source format for companies to share their part libraries with designers, creators and builders. All data should be hosted on git so changes can easily be push/pulled. Think of it like npm, composer or bower except than for parts. This meta information can be used with your inventory or stock software or with our stock manager software (WIP).

We hope that this format will be more widely used and great apps can be build on top of this. And most important streamline the product development or product optimalisation process.

Each respository should look like this:

A package.json file descriping the library
Seperate *.json files referered by the package.json descripting each part ()


Installation
---
1. Download and install nodejs with npm (https://nodejs.org/en/)
2. Run
	
	npm i -g https://github.com/jellehak/partmanager.git or (near future npm i -g partm) 


Usage
---
The global partm console app has the following instructions (simular to other packaging managers)

	partm install <*.git> (or) partm i <*.git>
	partm init <*.git>
	partm update <*.git>
	partm init <*.git>

You need CAD files for your project. Just run:

	partm i https://github.com/jellehak/partlib-hammond-sample.git

If you wish to create a project use
	
	partm init

To save a CAD part in your project run:
	
	partm i -s https://github.com/jellehak/partlib-hammond-sample.git


Example package scheme
---


Example part scheme
---
	{
		"title":"Hammond Enclosure 1455D802",
		"description":"Extruded alu enclosure - DESIGNED FOR 39MM WIDE PC BOARD",
		"partnumbers":"1455D802",
		"partnumbers":["1455D802","1455D802BK"],
		"units":"metric",
		"dimensions":{"length":80,"width":45,"height":25,"units":"mm"},
		"weight":0.1,
		"website":"http://www.hammondmfg.com/1455V2.htm",
		"vendors":[
			{"company":{"name":"Reichelt","website":"https://www.reichelt.nl","location":"DE"},"price":9.05,"deliverytime":{"mindays":1,"maxdays":2,"desc":"1-2 days"},"link":"https://www.reichelt.nl/Hammond-Aluminum-Enclosures/1455B1202BK/3/index.html?ACTION=3&LA=446&ARTICLE=121067&GROUPID=7732&artnr=1455B1202BK&SEARCH=alu%2Bcasing"}
		],
		"files":{
			"datasheets":["http://www.hammondmfg.com/pdf/1455D602.pdf"],
			"images":["http://www.hammondmfg.com/jpeg2/1455P1602_A2_B.jpg"],
			"cadfiles":[
				{"STEP":"http://www.hammondmfg.com/3DZip/1455D602.zip"}
			]
		}
	}



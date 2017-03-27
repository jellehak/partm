
Some resources used to create partm

Partm has been build for major part on npm and bower code
    https://github.com/bower/bower

Creating global node modules
    https://bretkikehara.wordpress.com/2013/05/02/nodejs-creating-your-first-global-module/

To test the bin run
    npm -g install .


Global libraries

You can run npm list -g to see where global libraries are installed.

On Unix systems they are normally placed in /usr/local/lib/node or /usr/local/lib/node_modules when installed globally. If you set the NODE_PATH environment variable to this path, the modules can be found by node.

Windows XP - %USERPROFILE%\Application Data\npm\node_modules
Windows 7 - %AppData%\npm\node_modules

Testing
---
	Just add the source code bin to your global path and test with following code

	partm init
    partm install https://github.com/jellehak/partm-hammond-sample
    partm version


Scheme debate
---
	Adding scripts to the parts like :

	"bin": {
		"hello": "./hello.js"
	},
	"scripts": {
		"fig": "figlet",
		"hello": "./hello.js"
	},
	"dependencies": {
		"figlet-cli": "^0.1.0"
	},
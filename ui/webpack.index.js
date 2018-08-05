// angular and additional dependencies import
print('Trying to bind all the files with webpack');
const jQuery = require('jquery');
const angular = require('angular');
const angularMaterial = require('angular-material');
const angularAnimate = require('angular-animate');
const angularCookies = require('angular-cookies');
const angularMocks = require('angular-mocks');
const angularMoment = require('angular-moment');
const angularNvd3 = require('angular-nvd3');
const angularSanitize = require('angular-sanitize');
const angularTouch = require('angular-touch');
const uirouter = require('@uirouter/angularjs');
const lodash = require('lodash');
const socketIOClient = require('socket.io-client');

// app imports
/**
approach 1 :

    four level dependency injection
    src/
      app/
        **.js
        **\/
          **.js
        **\/
          **\/
            **.js

approach 2 :
  static imports of required files, which is a regression
  and have to updated on every new file addition.

approach 3 :
  got a good approach? hit us
  https://github.com/scorelab/bassa/issues/
*/
// approach 1 :: 
var fsImports = require.context('./src/app', true, /\w+\.(js)$/);
console.log(fsImports.keys());
fsImports.keys().forEach(requireModules);

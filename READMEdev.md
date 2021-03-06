# Developer README for [msfeature]
Setup to test via [travis] (see the .travis.yml file)
NOTE: the travis test use phantomjs and xvfb for headless selenium

test/features - the features to test (cuke) 
test/site - the test target site (node)
test/spec - the unit tests

## Dev Test
1. npm install -g webdriver-manager
1. cd ~/Code
1. git clone https://github.com/ctrees/msfeature
1. cd msfeature
1. npm install
1. webdriver-manager update --standalone
1. webdriver-manager start
1. npm start
1. npm test

## dev-test code coverage via [istanbul]
1. ./node_modules/.bin/istanbul cover test/runner.js --root ./lib
1. npm run coverage
1. [istanbul] creates coverage directory a html navigable tree/website
1. The Travis script also uses coveralls to create [codeclimate] badge info

## dev-test Feature Add Example
1. Background of Feature Add motivation
    1. There is an issue with waiting for a javascript page to become stable esp with any type of animation
    1. [protractor] had [browser.waitForAngular()] which I like because it used a feature depenency in the framework to regulate the test process
    1. SO let's add a feature to [msfeature] that is used in the framework
    1. Currently [pace.js] is used in the base UI template
    1. [pace.js] will fire events when done and when it hides the page load animation
    1. GREAT... if we add a [msfeature] that listens to that event BEFORE doing any page queries we should be able to REMOVE all the 'And I wait x seconds' from the feature files
    1. THIS is a user UI/UX [DSL] improvement as the animation is there to give feedback to the user to WAIT for page to load... this is alignment of the [DSL] to the expected user UX/UI
1. Feature Replacement GOAL: Replace step 'And I wait x seconds' with 'When the Page is ready'
    1. First Create a test that Fails
    1. SO... pull [msfeature] and setup for [msfeature dev](#dev-test)
    1. Create new feature file [pace.feature]
    1. catmini:msfeature cat$ npm test
    1. Should get test of [pace.feature]
    1. NOW we add [pace.js] test page to the test/site server
    1. Add route to line 24 and 25 to test/site/server.js
    1. Add [pace.js] to test/site/pace.js
    1. Add [pace.css] to test/site/pace-theme-center-simple.css
    1. Add the pace view to test/site/routes.js
    1. Add the view to test/site/views/pace.swig which is the page we will test
    1. Go view the test page: http://localhost:3000/pace
    1. Now, to simulate a slow page... we setup a page request that take a delay as a param
    1. Add the delay route to test/site/server.js
    1. Add the delay code to test/site/routes.js
    1. I uncommented the @wip tag in test/runner.js (so just test @wip features)
    1. npm test
    1. tweak test/features/pace.feature [pace.feature] and test/site/views/pace.swig [pace.swig]
1. Review the [protractor] client js pattern
    1. Now we've got a target event to listen withing the client side JS [pase.js] lets create a feature like [browser.waitForAngular()]
    1. Looking at [protractor] structure [functions.waitForAngular()] we may want to concider just adopting the protractor framework for passing client side functions.
    1. At Line 696 (the bottom) of [functions.waitForAngular()] we see how protrator exports client side scripts
    1. At Line 350 of [protractor.prototype.waitForAngular] we see how protractor pulls in and uses [functions.waitForAngular()]
1. Review the [msfeature] methods pattern
    1. To Do ?? if helpfull ??
1. Extend the [msfeature] api using [protractor] style client js event listener to gate client-side testing flow
    1. [msfeature] uses [webdriverio] package where [protractor] uses [selenium-webdriver] 
    1. [msfeature] uses [webdriverio] and adds the methods as prototypes in the driver/methods directory tree
    1. To extend client executed code a reasonable place would be to add a new method would be lib/driver/methods
    1. See [cucumber-mink Issue 26] which leads to [cucumber-mink feature/angularjs-support]
    1. So we want to add new method waitForPace.js that looks like waitForAngular.js
    1. Enable and start testing waitForAngular to verify code works
    1. Push this commit with comment "waitForAngular test changes" [msfeature - waitForAngular test]
    1. So now test waitForPace but triggered off of the pace.done event
    1. Add feature step to lib/step_definitions/index.js
    1. Add step code lib/step_definitions/ext/utility.js
    1. Add method lib/driver/methods/waitForPace.js
    1. Restart selenium: webdriver-manager start
    1. Restart webserver: npm start
    1. Run test: npm 
    1. Push this commit with comment "waitForPace test changes" [msfeature - waitForPace test]
    1. DEBUG stuff... so run with "DEBUG=* npm test"
    1. We find that window.pace is not found
    1. Go to http://localhost:3000/pace and open up devtools console and type window. 
    1. We find it is Pace not pace... so correct that..
    1. We find out it's looking for the selector passed in by the feature
        1. Edit "done" to ".pace" in feature
        1. Remove first mspage is feature check as the functions hooks onto the done event
        1. added more event listeners in pace.swig with console comments
        1. added all pace events http://github.hubspot.com/pace/ to pace.swig for later reference
    1. Run test... that seems to work
    1. Push this commit with comment "waitForPace test working" [msfeature - waitForAngular working]
1. Cleanup default testing setup
    1. Change feature to 'msPageLoad ".pace" is done'
    1. Update test/pace.feature for wording
    1. Update lib/step_definitions/index.js for wording
    1. Update test/runner.js to remove @wip filter and switch back to firefox, travis compatable.
    1. Rerun tests to verify
    1. CRAP... we have erros
    1. In test/runner.js turn back on @wip to focus tests on the errors all in pace tests
    1. So after hacking abit... I should have used Pace.on('hide'... not Pace.on('done'... if I want to test the the loadbar is not visable after things are done
    1. Cleanup again...
    1. Some lint issues with lib/driver/methods/waitForPace.js AND the 'hide' vs 'done' correction
    1. Some timing issues with the old scenario test/features/pace.features
    1. Now getting full clean runs
    1. Push this commit with comment "waitForPace test working really" [msfeature - waitForAngular working really]
1. npm msfeature version bump and release
    1. [npm msfeature] I login as ctrees
    1. cd ~/Code/msfeature
    1. npm config ls -l
    1. Verify user is set if not set it
        1. npm set init.author.name "Chris Trees"
        1. npm set init.author.email "ctrees@mailserviceslc.com"
        1. npm set init.author.url "http://mailserviceslc.com"
        1. npm adduser
        1. Fill in requests from adduser with your npm account stuff
    1. Bump the package.json version NOTE: should have done this when I began the changes
        1. vi package.json -> "version": "0.0.2",
        1. git add .
        1. git commit -m "npm msfeature v0.0.2"
        1. git tag 0.0.2
        1. git push origin master --tags
    1. npm publish
    1. Now check [npm msfeature] it should have "0.0.2 is the latest release"
1. next step

## General Structure and Principles
1. The goal of [msfeature] is to create a [DSL] specific for [Mail Services, LLC]
1. [msfeature] is a hack of [cucumber-mink] a fork of [community cucumber-mink] 
1. [msfeature] uses [webdriver] to communicate over [JsonWireProtocol] to a [W3C browser]
1. [msfeature] is driven by a feature text file in [cucumber] language
1. [msfeature] contains [msDSL] a [cucumber-mink] extention example: 

[msfeature]: https://github.com/ctrees/msfeature
[msfeature dev]: https://github.com/ctrees/msfeature/blob/master/READMEdev.md
[msfeature - waitForAngular test]: https://github.com/ctrees/msfeature/commit/715027bafa66cf4b742486c4861a42841e934a69
[msfeature - waitForAngular working]: https://github.com/ctrees/msfeature/commit/e73941d92dbd16fefe0fc82d38e4648e2c42ea55
[msfeature - waitForAngular working really]: https://github.com/ctrees/msfeature/commit/05d3aa8371e71ad33c987fa1ad2465ff17079101
[npm msfeature]: https://www.npmjs.com/package/msfeature
[DSL]: https://en.wikipedia.org/wiki/Domain-specific_language
[Mail Services, LLC]: https://www.mailserviceslc.com/
[istanbul]: http://gotwarlost.github.io/istanbul/
[codeclimate]: https://codeclimate.com/
[travis]: https://travis-ci.org/
[cucumber-mink]: https://github.com/ctrees/cucumber-mink
[community cucumber-mink]: http://cucumber-mink.js.org/
[cucumber-mink Issue 26]: https://github.com/Adezandee/cucumber-mink/issues/26
[cucumber-mink feature/angularjs-support]: https://github.com/Adezandee/cucumber-mink#feature/angularjs-support
[cucumber-mink steps]: http://cucumber-mink.js.org/steps
[webdriver]: http://webdriver.io/api.html
[webdriverio]: https://www.npmjs.com/package/webdriverio
[JsonWireProtocol]: https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol
[W3C browser]: https://w3c.github.io/webdriver/webdriver-spec.html
[cucumber]: https://cucumber.io/
[protractor]: https://github.com/angular/protractor
[selenium-webdriver]: https://www.npmjs.com/package/selenium-webdriver
[browser.waitForAngular()]: https://github.com/angular/protractor/blob/9144494a28dac5a0409de4c5384e933f2d2f8156/spec/plugins/specs/browser_get_wait_spec.js
[functions.waitForAngular()]: https://github.com/angular/protractor/blob/9144494a28dac5a0409de4c5384e933f2d2f8156/lib/clientsidescripts.js
[protractor.prototype.waitForAngular]: https://github.com/angular/protractor/blob/9144494a28dac5a0409de4c5384e933f2d2f8156/lib/protractor.js 
[pace.js]: https://github.com/HubSpot/pace
[pace.css]: http://github.hubspot.com/pace/docs/welcome/
[pace.feature]: https://github.com/ctrees/msfeature/blob/master/test/features/pace.feature
[pace.swig]: https://github.com/ctrees/msfeature/blob/master/test/site/views/pace.swig
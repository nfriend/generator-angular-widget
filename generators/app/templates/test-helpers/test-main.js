// Sets up jasmine and triggers tests to run

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };

var allPaths = Object.keys(window.__karma__.files).filter(onlySpecFiles);

System.import('app/test-bootstrap').then(() => {

    // for each *.spec.js, import the file to run the test.  
    // Once these have completed, start Karma
    Promise.all(allPaths.map(function (path) {
        return System.import(path);
    })).then(window.__karma__.start);

});

function onlySpecFiles(path) {
    return /^\/base\/app.*\.spec\.js$/.test(path);
}
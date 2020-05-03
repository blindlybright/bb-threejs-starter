
// !!! require.context is a webpack-specific feature, so it doesn't work in jest (possibly You can try to mock it somehow)
// This will search for files ending in .spec.js and require them
// so that they are added to the webpack bundle


const testsContext = require.context('./src', true, /.*\.spec\.js$|.*\.spec\.ts$/);
testsContext.keys().forEach(testsContext);


// modules that are not tests
const modulesContext = require.context('./src', true, /^(?!.*(?:[\.spec\.js$|\.spec\.ts$])).*\.js$/);
modulesContext.keys().forEach(modulesContext);

module.exports = {
    testsContext,
    modulesContext
};

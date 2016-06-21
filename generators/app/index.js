var generators = require('yeoman-generator');
var camelCase = require('camelcase');
var upperCamelCase = require('uppercamelcase');
var decamelize = require('decamelize');
var rename = require('gulp-rename');

// from http://stackoverflow.com/a/7592235/1063392
var capitalize = function (str) {
    return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        // run "yo angular-widget --noinstall" to run this generator
        // without running npm install, jspm install, or gulp build-local
        this.option('noinstall');
    },
    initializing: function () {
        this.props = {};
    },
    prompting: function () {
        return this.prompt([
            {
                type: 'input',
                name: 'widgetName',
                message: 'Your widget\'s name:',
                default: this.appname.replace(/\s/g, '-'),
                validate: function (input) {
                    if (/\s/.test(input)) {
                        return 'Widget name connot contain whitespace';
                    }
                    if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
                        return 'Widget name must only contain letters, numbers, hyphens, and underscores';
                    }
                    if (!/^[a-zA-Z]+/.test(input)) {
                        return 'Widget name must begin with a letter';
                    }

                    return true;
                }
            }]
        ).then(function (answers) {
            this.props.widgetTitle = capitalize(decamelize(camelCase(answers.widgetName), ' '));
            this.props.directiveName = decamelize(answers.widgetName, '-');
            this.props.widgetName = answers.widgetName;
            this.props.className = upperCamelCase(answers.widgetName);
            this.props.variableName = camelCase(answers.widgetName);
        }.bind(this));
    },
    copyAppTemplate: function () {
        var _this = this;

        // before each file is written, rename its destination path and filename
        // to replace "widget" with props.widgetName
        this.registerTransformStream(rename(function (path) {
            path.dirname = path.dirname.replace('widget', _this.props.widgetName);
            path.basename = path.basename.replace('widget', _this.props.widgetName);
            return path;
        }));

        this.fs.copyTpl(this.templatePath('**/*'), this.destinationPath('.'), this.props);

        // assets get corrupted in the above templating process, so 
        // overwrite the corrupted versions with clean, non-templated versions
        this.fs.copy(this.templatePath('app/assets/**/*'), this.destinationPath('app/assets'));

        // although we do want this *one* file in the assets directory
        // to be templated, so now overwrite the *non* templated version
        this.fs.copyTpl(this.templatePath('app/assets/WhereToPutAssets.md'), this.destinationPath('app/assets/WhereToPutAssets.md'), this.props);

        // for some reason, the .gitignore isn't being copied as part of the copy process above.
        // copy it manually here.
        this.fs.copy(this.templatePath('./.gitignore'), this.destinationPath('./.gitignore'), this.props);
    },
    install: function () {
        var _this = this;

        if (!this.options.noinstall) {
            
            // run a npm install
            this.log('Running npm install...');
            this.npmInstall(null, null, function () {

                // then, run a jspm install
                _this.log('Running jspm install...');
                _this.spawnCommandSync('jspm', ['install']);

                // then, run a gulp build-local
                _this.log('Running gulp build-local...');
                _this.spawnCommandSync('gulp', ['build-local']);
            });
        } else {
            this.log('Skipping installs because the "--noinstall" flag was provided');
        }
    }
});
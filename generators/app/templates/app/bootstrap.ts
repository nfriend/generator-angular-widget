import angular from 'angular';
import {<%= variableName %>Module} from './<%= widgetName %>/<%= widgetName %>.module';

angular.bootstrap(document, [<%= variableName %>Module.name]);
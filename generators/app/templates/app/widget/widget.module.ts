import angular from 'angular';
import 'angular-material';
import './<%= widgetName %>.templates.js';
import './<%= widgetName %>.css!';
import {<%= className %>Controller} from './<%= widgetName %>.controller';
import {<%= className %>Directive} from './<%= widgetName %>.directive';
import {<%= className %>Service} from './<%= widgetName %>.service';

var <%= variableName %>Module = angular.module('<%= className %>Module', ['ngMaterial', '<%= widgetName %>-templates']);

<%= variableName %>Module.service(<%= className %>Service.injectionName, <%= className %>Service);
<%= variableName %>Module.controller(<%= className %>Controller.injectionName, <%= className %>Controller);
<%= variableName %>Module.directive(<%= className %>Directive.injectionName, [() => new <%= className %>Directive()]);

export {<%= variableName %>Module};
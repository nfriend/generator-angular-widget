import {<%= className %>Service} from './<%= widgetName %>.service';

export class <%= className %>Controller {
    public static injectionName = '<%= className %>Controller';
    public static $inject = ['$scope', <%= className %>Service.injectionName];

    constructor(private scope: ng.IScope, private <%= variableName %>Service: <%= className %>Service) {
        <%= variableName %>Service.doSomething();
    }
}
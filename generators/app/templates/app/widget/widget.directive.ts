import {<%= className %>Controller} from './<%= widgetName %>.controller';

export class <%= className %>Directive {
    public restrict = 'E';
    public static injectionName = '<%= variableName %>';
    public templateUrl = 'app/<%= widgetName %>/<%= widgetName %>.tmpl.html';
    public controller = <%= className %>Controller.injectionName;
    public controllerAs = 'vm';
    public bindToController = true;
    public scope = {};
}
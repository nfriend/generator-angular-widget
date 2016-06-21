import {<%= className %>Service} from './<%= widgetName %>.service';

describe('<%= className %>Service', () => {

    let <%= variableName %>Service: <%= className %>Service,
        $log: ng.ILogService;

    beforeEach(() => {
        inject((_$log_: ng.ILogService) => {
            $log = _$log_;
        });

        <%= variableName %>Service = new <%= className %>Service($log);
    });

    it('Verifies that the <%= className %>ServiceService does something', () => {
        spyOn($log, 'info').and.callThrough();
        <%= variableName %>Service.doSomething();
        expect($log.info).toHaveBeenCalledWith('The <%= className %>Service did something!');
    });
});
export class <%= className %>Service {
    public static injectionName = '<%= className %>Service';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {

    }

    public doSomething = (): void => {
        this.$log.info('The <%= className %>Service did something!');
    }
}
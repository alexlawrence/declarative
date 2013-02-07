describe('common/Deferred', function() {

    var Deferred = require('../../src/common/Deferred');

    describe('resolving', function() {

        describe('calling resolve() after one then() call', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('success handler');

                deferred.then(spy);

                deferred.resolve(arg1, arg2, arg3);
            });

            it('should execute the success handler passed to then()', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all resolve() arguments on to the success handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling resolve() twice after one then() call', function() {

            it('should execute the success handler only once', function() {

                var deferred = new Deferred();
                var spy = jasmine.createSpy('success handler');

                deferred.then(spy);

                deferred.resolve();
                deferred.resolve();

                expect(spy.callCount).toBe(1);

            });

        });

        describe('calling resolve() after multiple separate then() calls', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.then(spy1);
                deferred.then(spy2);
                deferred.resolve();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling then() after resolve() was already called', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('success handler');

                deferred.resolve(arg1, arg2, arg3);
                deferred.then(spy);
            });

            it('should nevertheless execute the success handler', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all resolve() arguments on to the success handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling then() twice separately after resolve() was already called', function() {

            it('should nevertheless execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.resolve();
                deferred.then(spy1);
                deferred.then(spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling resolve() after calling then() in a chain', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.then(spy1).then(spy2);
                deferred.resolve();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

            it('should execute the error handler of a then() if the preceding success handler throws an error', function() {

                var deferred = new Deferred();
                var dummy = function() {};
                var error = new Error();
                var errorHandler = function() { throw error; };
                var spy = jasmine.createSpy('error handler');

                deferred.then(dummy).then(errorHandler).then(dummy, spy);
                deferred.resolve();

                expect(spy).toHaveBeenCalledWith(error);

            });

            it('should pass return values of preceding then() success handlers to the following success handlers', function() {

                var deferred = new Deferred();
                var args = {};
                var callback = function() {
                    return args;
                };
                var spy = jasmine.createSpy('success handler 2');

                deferred.then(callback).then(spy);
                deferred.resolve();

                expect(spy).toHaveBeenCalledWith(args);

            });

        });

        describe('calling then() in a chain after the first deferred was already resolved', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.resolve();
                deferred.then(spy1).then(spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

    });

    describe('rejecting', function() {

        describe('calling reject() after one then() call', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('error handler');

                deferred.then(function() {}, spy);

                deferred.reject(arg1, arg2, arg3);
            });

            it('should execute the error handler passed to then()', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all reject() arguments on to the error handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling reject() twice after one then() call', function() {

            it('should execute the error handler only once', function() {

                var deferred = new Deferred();
                var spy = jasmine.createSpy('error handler');

                deferred.then(function() {}, spy);

                deferred.reject();
                deferred.reject();

                expect(spy.callCount).toBe(1);

            });

        });

        describe('calling reject() after multiple separate then() calls', function() {

            it('should execute all error handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('error handler 1');
                var spy2 = jasmine.createSpy('error handler 2');

                deferred.then(function(){}, spy1);
                deferred.then(function(){}, spy2);
                deferred.reject();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling then() after reject() was already called', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('error handler');

                deferred.reject(arg1, arg2, arg3);

                deferred.then(function() {}, spy);
            });

            it('should nevertheless execute the error handler', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all reject() arguments on to the error handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling then() twice separately after reject() was already called', function() {

            it('should nevertheless execute all error handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('error handler 1');
                var spy2 = jasmine.createSpy('error handler 2');

                deferred.reject();
                deferred.then(function() {}, spy1);
                deferred.then(function() {}, spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

    });

});
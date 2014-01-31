/**
 * Created by krona on 1/31/14.
 */
define(function () {
    return {
        hitch: function (scope, callback) {
            return function () {
                return callback.apply(scope, arguments);
            }
        }
    };
});
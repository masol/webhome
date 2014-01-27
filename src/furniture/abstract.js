define(['fabric'], function(fabric){
    fabric.Furniture = fabric.util.createClass(fabric.Image, {
        type: 'furniture'
    });
    fabric.Furniture.async = true;
    /**
     * Creates an instance of fabric.Furniture from its object representation
     * @static
     * @param {Object} object Object to create an instance from
     * @param {Function} [callback] Callback to invoke when an image instance is created
     */
    fabric.Furniture.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            fabric.Furniture.prototype._initFilters.call(object, object, function(filters) {
                object.filters = filters || [ ];
                var instance = new fabric.Furniture(img, object);
                callback && callback(instance);
            });
        }, null, object.crossOrigin);
    };

    /**
     * Creates an instance of fabric.Furniture from an URL string
     * @static
     * @param {String} url URL to create an image from
     * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
     * @param {Object} [imgOptions] Options object
     */
    fabric.Furniture.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback(new fabric.Furniture(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
    return fabric.Furniture;
});
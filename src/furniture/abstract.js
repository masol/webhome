define(['fabric'], function(fabric){
    var Furniture = fabric.util.createClass(fabric.Object, {
        type: 'furniture',
        options: undefined,
        image: undefined,
        initialize: function(options){
            options = options || {};
            this.setOptions(options);
        },
        setOptions: function(options){
            this.options = options;
            if(options.image){
                this._initImage();
            }
        },
        setImage: function(image){
            this.options.image = image;
            this._initImage();
        },
        _initImage: function(){
            if(typeof this.options.image == "string"){
                this.image = document.querySelector(this.options.image);
            } else {
                this.image = this.options.image;
            }
        },
        render: function(ctx, noTransform) {
            // do not render if object is not visible
            if (!this.visible) return;

            ctx.save();
            var m = this.transformMatrix;
            var isInPathGroup = this.group && this.group.type === 'path-group';

            // this._resetWidthHeight();
            if (isInPathGroup) {
                ctx.translate(-this.group.width/2 + this.width/2, -this.group.height/2 + this.height/2);
            }
            if (m) {
                ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            }
            if (!noTransform) {
                this.transform(ctx);
            }

            ctx.save();
            this._setShadow(ctx);
            this.clipTo && fabric.util.clipContext(this, ctx);
            this._render(ctx);
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            this._renderStroke(ctx);
            this.clipTo && ctx.restore();
            ctx.restore();

            if (this.active && !noTransform) {
                this.drawBorders(ctx);
                this.drawControls(ctx);
            }
            ctx.restore();
        },
        _render: function(ctx){
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }
    });
    Furniture.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            object.image = img;
            callback && callback(new Furniture(object));
        }, null, object.crossOrigin);
    };
    Furniture.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            imgOptions.image = img;
            callback(new Furniture(imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
    return Furniture;
});
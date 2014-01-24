WebHome
=======

  Welcome to webhome. WebHome is a javascript library that utilizing the power of html5 canvas to help people designing their home. It's ownered by SanPolo.Co.LTD and published under the license of MIT. WebHome internal using javascript canvas library [Fabric.js](http://fabricjs.com/).

Background
----------

 webhome is open source project supported by [SanPolo.Co.LTD](http://www.spolo.org). Official hosted at [opensource community of SanPolo Co.LTD](https://osc.spolo.org/root/webhome/tree/master).
 

about the code
--------------

1. The testing code is under the test directory. You can reading it to get a first-impression how to using webhome. WebHome provide a pure home editor controller, you can instantiate and connect with it's event.
2. The controller itself support follow concept:
  * Action : you can add,remove,replace some home item into controller.
  * State : controller will in different state. Every state support different interaction schema. (I.E Edit state or Draw state has differenct interaction schema)
  * Event : you can connect handler to event.
3. Boundary of the controller:
  * The controller itself don't care how to synchronize data with remote server. Manipulating data.io is the duty of caller instead of Webhome itself. You can check the testing code to understanding this.
  * The controller itself only manipulate the editing window. I.E
  ```javascript
  var homectl = webhome.Create('test');
  ```
  This homectl only generate the scene. No toolbar, tree tec... It's the duty of caller to manipulate other UI widget.






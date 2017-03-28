
//Ponteiro
pd.setInput = function(layer, eventId, funcToCall, multiTouch) {

	if(multiTouch == null || multiTouch == undefined)
		multiTouch = 0;
	
	//event creation
	if( eventId == 0){//mouse Down
		var listener = input_createDownEvent(funcToCall, multiTouch);
	}
	if( eventId == 1){//mouse Move
		var listener = input_createDragEvent(funcToCall, multiTouch);
	}
	if( eventId == 2){//mouse Up
		var listener = input_createUpEvent(funcToCall, multiTouch);
	}
	if( eventId == 3){//acc
		if(cc.sys.isMobile){
			var listener = input_createAccelerometer(funcToCall);
			cc.eventManager.addListener(listener, layer);
		}
	}
	else{
		cc.eventManager.addListener(listener, layer);		
	}

};

input_createAccelerometer = function(func){
	cc.inputManager.setAccelerometerInterval(1/10);
	cc.inputManager.setAccelerometerEnabled(true);
	var listener = cc.EventListener.create({
		event:cc.EventListener.ACCELERATION,

		callback: function(acc, event) {
			var target = event.getCurrentTarget();

			target[func](acc);
		}
	});
	return listener;

}

input_createDownEvent = function(func, multiTouch){
	if(cc.sys.isMobile) {
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE, 
			onTouchBegan: function (touch, event) {  
				var target = event.getCurrentTarget();
				cc.log('tst')
				if(touch.getId() <= multiTouch){
					target[func](touch);
				}
				return true;
			}
		});
	}
	else {
		var listener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,                   
			onMouseDown: function (event) {  
				var target = event.getCurrentTarget();  
				if(event.getButton() == 0)
					target[func](event);
			}
		});
	}
	return listener;
}
input_createDragEvent = function(func, multiTouch){
	if(cc.sys.isMobile) {
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE, 
			onTouchBegan: function (touch, event) {  
				
				return true;
			},
			onTouchMoved: function (touch, event) {  
				var target = event.getCurrentTarget();
				if(touch.getId() <= multiTouch){
					target[func](touch);
				}
				return true;
			}
		});
	}
	else {
		var listener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,                   
			onMouseMove: function (event) {  
				var target = event.getCurrentTarget();  
				if(event.getButton() == 0)
					target[func](event);
			}
		});
	}
	return listener;
}
input_createUpEvent = function(func, multiTouch){
	if(cc.sys.isMobile) {
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE, 
			onTouchBegan: function (touch, event) {  
				
				return true;
			},
			onTouchEnded: function (touch, event) {  
				cc.log('tst')
				var target = event.getCurrentTarget();
				if(touch.getId() <= multiTouch){
					target[func](touch);
				}
				return true;
			}
		});
	}
	else {
		var listener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,                   
			onMouseUp: function (event) {  
				var target = event.getCurrentTarget();  
				if(event.getButton() == 0)
					target[func](event);
			}
		});
	}
	return listener;
}

pd.setInput.MOUSE_DOWN = 0;
pd.setInput.MOUSE_MOVE = 1;
pd.setInput.MOUSE_UP = 2;
pd.setInput.ACCELEROMETER = 3;



///Keyboard


pd.setKeyboard = function(layer, funcKeyDown, funcKeyUp){
	if(!cc.sys.isMobile){
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed:  function(keyCode, event){
				var target = event.getCurrentTarget();
				target[funcKeyDown](keyCode, event);
			},
			onKeyReleased: function(keyCode, event){
				var target = event.getCurrentTarget();
				target[funcKeyUp](keyCode, event);
			}
		}, layer);
	}
}



//outros

pd.setInputForButton = function(layer) {
//	Seta um listener para os eventos de mouse e touch de uma layer
	if(cc.sys.isMobile) {
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ALL_AT_ONCE, 
			onTouchesBegan: function (touch, event) {  
				var target = event.getCurrentTarget();
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseDown(touch);
				//}g
				return false;
			},
			onTouchesEnded: function (touch, event) {  
				var target = event.getCurrentTarget(); 
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseUp(touch);
				return false;
				//}
			},
			onTouchesMoved: function (touches, event) {
				var target = event.getCurrentTarget(); 
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseDragged(touches);
				//}
				return false;
			},
		});
	}

	else {
		var listener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,                   
			onMouseDown: function (event) {  
				var target = event.getCurrentTarget();  
				target.onMouseDown(event);
			},
			onMouseUp: function (event) {  
				var target = event.getCurrentTarget();  
				target.onMouseUp(event);
			},
			onMouseMove: function (event) {  
				var target = event.getCurrentTarget();  
				target.onMouseDragged(event);
			}
		});
	}

	cc.eventManager.addListener(listener, layer);
	cc.eventManager.setPriority(listener, 1);

	if (!cc.sys.isMobile) {
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed:  function(keyCode, event){
				var target = event.getCurrentTarget();
				target.keyDown(keyCode, event);
			},
			onKeyReleased: function(keyCode, event){
				var target = event.getCurrentTarget();
				target.keyReleased(keyCode, event);
			}
		}, layer);
	}

};
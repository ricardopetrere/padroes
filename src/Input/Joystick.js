var singletonJoyStick = 0;

pd.Joystick = cc.Layer.extend(
	{
		isGrabbed:false,
		touchId:null,
		isNative:null,
		joystickBG:null,
		joystickStick:null,
		delta:null,
		power:null,
		mousePressed:null,
		eventForCallBack:null,
		clickInitialPosition:null,
		id:null,
		callBack:null,
		event:null,
		eventName:null,

		keyUpState:false,
		keyDownState:false,
		keyLeftState:false,
		keyRightState:false,
		
		ctor:function(x, y, ParentNode, uiSprite, stickSprite, eventToCall){
			this._super();

			singletonJoyStick++;
			this.id = singletonJoyStick;
			var nome = "button" + this.id.toString();
			this.createCustomListener(eventToCall, nome, ParentNode, false);

			
			this.eventForCallBack = eventToCall;
			this.mousePressed = null;
			this.delta = null;
			this.power = cc.p(0,0);
			this.isGrabbed = false;
			this.touchId = null;
			this.clickInitialPosition = null;
			if (!cc.sys.isMobile) {
				this.isNative = false;
			}
			else{
				this.isNative = true;
			}
			this.joystickBG = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(uiSprite));
			this.joystickBG.setPosition(x,y);
			this.joystickBG.setColor(cc.color(25,225,225,255));
		
			this.joystickStick = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(stickSprite));
			this.joystickStick.CenterPosition = cc.p(this.joystickBG.getPosition());
			this.joystickStick.setPosition(this.joystickStick.CenterPosition);
		
			this.addChild(this.joystickBG,1000);
			this.addChild(this.joystickStick,1001);
			pd.setInputForJoystick(this);

			
			return true;
		},
		
		onMouseDown:function(event){
			if(!this.isNative){
				this.mousePressed = true;
				this.delta = this.getStickState(event);
			}
			else{
				for(i in event){
					if(singletonTouchId[i] == false){
						this.delta = this.getStickState(event[i]);
						if(this.delta != false)
							break;
					}
				}
			}
			if(this.delta != null && this.delta != undefined){
				if(this.delta != false){
					this.callCustomCallBack(this.delta, this.power);
					//this.eventForCallBack(this.delta, this.power);
				}
			}
		},
		onMouseUp:function(event){
			if(!this.isNative){
				this.mousePressed = false;
				this.releasedEvent(event);
				this.callCustomCallBack(new cc.p(0,0), new cc.p(0,0));
			}
			else {
				for(i in event){
					if(event[i].getId() == this.touchId){
						this.releasedEvent(event[i]);
						this.callCustomCallBack(new cc.p(0,0), new cc.p(0,0));
						break;
					}
				}
			}
		},
		onMouseDragged:function(event){
			if(this.isNative){
				for(i in event){
					if(event[i].getId() == this.touchId){
						this.delta = this.getStickState(event[i]);
						this.callCustomCallBack(this.delta, this.power);
						break;
					}
				}
			}
			else if(this.mousePressed){
				this.delta = this.getStickState(event);
				this.callCustomCallBack(this.delta, this.power);
			}
		},
		keyDown:function(keyCode, event){
			this.delta = this.getStickState(event, keyCode);
			this.callCustomCallBack(this.delta, this.power);
		},
		keyReleased:function(keyCode, event){
			this.releasedEvent(event, keyCode);
			this.callCustomCallBack(this.delta, this.power);
		},
		
		setColor:function(r,g,b,a){
			this.joystickBG.setColor(cc.color(r,g,b,a));
			this.joystickStick.setColor(cc.color(r,g,b,a));
		},
		computeKey:function(){
			var point = cc.p(0,0);
			this.power = cc.p(0,0);
			if(this.keyUpState){
				point.y += 1;
				this.power.y = 1;
			}
			if(this.keyDownState){
				point.y -= 1;
				this.power.y = 1;				
			}
			if(this.keyRightState){
				point.x += 1;
				this.power.x = 1;
			}
			if(this.keyLeftState){
				point.x -= 1;
				this.power.x = 1;
			}
			return point;
			
		},
		getStickState:function(event, keyCode){
			if(keyCode != null && keyCode != undefined){//teclado
				if(keyCode == 40){//baixo
					this.keyDownState = true;
				}
				if(keyCode == 38){//cima
					this.keyUpState = true;
				}
				if(keyCode == 39){//direita
					this.keyRightState = true;
				}
				if(keyCode == 37){//esquerda
					this.keyLeftState = true;
				}
				return this.computeKey();
			}
			else{
				var position = event.getLocation();
				if(!this.isGrabbed){//ainda não foi clicado
					var tempBox = cc.rect(position.x, position.y, 1,1);
					if(cc.rectIntersectsRect(this.joystickStick.getBoundingBox(), tempBox)){
						this.isGrabbed = true;
						if(this.isNative){
							this.touchId = event.getId();
						}
						this.clickInitialPosition = event.getLocation();
						ret = new cc.p(0,0);
						return ret;
						
					}
					else{
						ret = false;
						return ret;
					}
				}
				else{//verificando movimentação
					if(this.isNative){
						if(event.getId() == this.touchId){
							var ret = this.getDelta(event);
							return ret;
						}
					}
					else{
						var ret = this.getDelta(event);
						return ret;
					}
				}
			}
			return false;
		},
		getDelta:function(event, isKeyboard){
			
			if(isKeyboard != null && isKeyboard != undefined){
				var deltaX = event.x - this.joystickStick.CenterPosition.x;
				var deltaY = event.y - this.joystickStick.CenterPosition.y;
				var diferencaX = event.x - this.joystickBG.getPosition().x;//this.clickInitialPosition.x;
				var diferencaY = event.y - this.joystickBG.getPosition().y//- this.clickInitialPosition.y;
			}
			else{
				var deltaX = event.getLocation().x - this.joystickStick.CenterPosition.x;
				var deltaY = event.getLocation().y - this.joystickStick.CenterPosition.y;
				var diferencaX = event.getLocation().x - this.joystickBG.getPosition().x;//this.clickInitialPosition.x;
				var diferencaY = event.getLocation().y - this.joystickBG.getPosition().y//- this.clickInitialPosition.y;
			}

			var anguloFormado = Math.atan2(deltaY, deltaX); //* 180 / Math.PI;
			var anguloX = Math.cos(anguloFormado);
			var anguloY = Math.sin(anguloFormado);
			
			if(diferencaX >= this.joystickBG.getBoundingBox().width/2 - this.joystickBG.getBoundingBox().width/10){
				diferencaX = this.joystickBG.getBoundingBox().width/2 - this.joystickBG.getBoundingBox().width/10;
			}
			else if(diferencaX <= -this.joystickBG.getBoundingBox().width/2 + this.joystickBG.getBoundingBox().width/10){
				diferencaX = -this.joystickBG.getBoundingBox().width/2 + this.joystickBG.getBoundingBox().width/10;
			}
			if(diferencaY >= this.joystickBG.getBoundingBox().height/2 - this.joystickBG.getBoundingBox().height/10){
				diferencaY = this.joystickBG.getBoundingBox().height/2 - this.joystickBG.getBoundingBox().height/10;
			}
			else if(diferencaY <= -this.joystickBG.getBoundingBox().height/2 + this.joystickBG.getBoundingBox().height/10){
				diferencaY = -this.joystickBG.getBoundingBox().height/2 + this.joystickBG.getBoundingBox().height/10;
			}
			if(Math.abs(diferencaX) > (this.joystickBG.getBoundingBox().width/2 - this.joystickBG.getBoundingBox().width/10) * Math.abs(anguloX))
			{
				diferencaX = (this.joystickBG.getBoundingBox().width/2 - this.joystickBG.getBoundingBox().width/10) * (anguloX)				
			}	
			if(Math.abs(diferencaY) > (this.joystickBG.getBoundingBox().height/2 - this.joystickBG.getBoundingBox().height/10) * Math.abs(anguloY))
			{
				diferencaY = (this.joystickBG.getBoundingBox().height/2 - this.joystickBG.getBoundingBox().height/10) * (anguloY);		
			}	
			//diferencaX = diferencaX * Math.abs(anguloX);
			//diferencaY = diferencaY * Math.abs(anguloY);
			
			this.joystickStick.setPosition(this.joystickStick.CenterPosition.x + diferencaX,
					this.joystickStick.CenterPosition.y + diferencaY);
		

			
			deltaX = this.joystickStick.getPosition().x - this.joystickStick.CenterPosition.x;
			deltaY = this.joystickStick.getPosition().y - this.joystickStick.CenterPosition.y;
			anguloFormado = Math.atan2(deltaY, deltaX); //* 180 / Math.PI;
			anguloX = Math.cos(anguloFormado);
			anguloY = Math.sin(anguloFormado);
			forcaX = Math.abs(deltaX) / (this.joystickBG.getBoundingBox().width/2);
			forcaY = Math.abs(deltaY) / (this.joystickBG.getBoundingBox().height/2);
			this.power = new cc.p(forcaX, forcaY);
			return (new cc.p(anguloX, anguloY));
		},
		releasedEvent:function(event, keyCode){
			if(keyCode != null && keyCode != undefined){//teclado
				if(keyCode == 40){//baixo
					this.keyDownState = false;
				}
				if(keyCode == 38){//cima
					this.keyUpState = false;
				}
				if(keyCode == 39){//direita
					this.keyRightState = false;
				}
				if(keyCode == 37){//esquerda
					this.keyLeftState = false;
				}
				delta = this.computeKey();
				this.callCustomCallBack(delta, this.power);
			}	
			else{
				if(this.isNative){
					if(event.getId() == this.touchId){
						this.isGrabbed = false;
						this.touchId = null;
						this.joystickStick.setPosition(this.joystickStick.CenterPosition);
					}
				}
				else{
					this.isGrabbed = false;
					this.touchId = null;
					this.joystickStick.setPosition(this.joystickStick.CenterPosition);
				}
			}
		},
		createCustomListener:function(CallBack, NomeDoEvento, target, funcArgs){
			this.funcToCall = CallBack;
			this.eventName = NomeDoEvento;
			this.funcCaller = target;
			this.funcArgs = funcArgs;
		},
		callCustomCallBack:function(arg1, arg2){
				this.funcCaller[this.funcToCall](arg1, arg2);
			
		},
		createCustomListenerBackUp: function(CallBack, NomeDoEvento, target, removeCallBack){
			this.removeCallBack = removeCallBack;
			if(target == null && target == undefined){
				target = this.getParent();
			}

			if(NomeDoEvento == undefined || NomeDoEvento == null){
				NomeDoEvento = 'padrao';
			}
			NomeDoEvento += this.id.toString();
			NomeDoEvento += Singleton_eventId.toString();
			Singleton_eventId ++;
			var evento = cc.EventListener.create({
				event: cc.EventListener.CUSTOM,
				press: false,
				eventName: NomeDoEvento,
				callback: function(event, press){
					var call = event.getUserData();
					var target = event.getCurrentTarget();
					target.call = call;
					target.call(event.delta, event.power);
				}
			});    
			if(CallBack == undefined || CallBack == null){
				cc.log('Parametro 1(CallBack) esta como nulo ou indefinido');
			}
			if(typeof(CallBack) != "function"){
				cc.log('CallBack Precisa ser uma função');
			}
			if(target == null || target == undefined){
				cc.log('Target esta nulo ou undefined, adicione esse LongEffectPlayer à layer que deseja chamar o CallBack');
			}
			this.callBack = CallBack;
			this.event = evento;
			cc.eventManager.addListener(this.event, target);
			this.eventName = NomeDoEvento;
		},
		//Ao termino do som, o callBack eh chamado
		callCustomCallBackBackup: function(delta, power){
			if((this.eventName == null || this.eventName == undefined) && this.event != null && this.event != undefined){
				cc.log('eventName nulo ou undefined, init chamado apos criação do CustomCallBack sem o parametro false');
			}
			if(this.eventName != null && this.eventName != undefined) {
				var evento = new cc.EventCustom(this.eventName);
				evento.setUserData(this.callBack);
				evento.delta = delta;
				evento.power = power;
				cc.eventManager.dispatchEvent(evento);
				if(this.removeCallBack != null && this.removeCallBack != undefined){
					if(this.removeCallBack)
						cc.eventManager.removeListener(this.event);
					this.event = null;
				}
			}
		}


	}
);


pd.setInputForJoystick = function(layer) {
//	Seta um listener para os eventos de mouse e touch de uma layer
	if(cc.sys.isMobile) {
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ALL_AT_ONCE,
			swallowTouches: false,
			onTouchesEnded: function (touch, event) {  
				var target = event.getCurrentTarget(); 
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseUp(touch);
				return false;
				//}
			},
			onTouchesBegan: function (touch, event) {  
				var target = event.getCurrentTarget();
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseDown(touch);
				//}
				return false;
			},
			onTouchesMoved: function (touches, event) {
				var target = event.getCurrentTarget(); 
				//if(touch.getId() == 0 || touch.getId() == 1){
				target.onMouseDragged(touches);
				//}
				return false;
			}
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
	cc.eventManager.setPriority(listener, 10);

	if (!cc.sys.isNative) {
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

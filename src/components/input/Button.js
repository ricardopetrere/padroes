var singletonJoyButton = 0;
var Singleton_eventId = 0;
pd.Button = cc.Sprite.extend(
	{
		isGrabbed:false,
		touchId:null,
		isNative:null,
		normalImg:null,
		pressedImg:null,
		keyValue:null,
		id:null,
		callBack:null,
		event:null,
		eventName:null,
		scalePressed: undefined,
		scaleReleased: 1,
		ctor:function(x, y, targetNode, eventToCall, normalImage, pressedImage, args, scale){
			this.scalePressed = scale;
			this._super();
			singletonJoyButton++;
			this.id = singletonJoyButton;
			var nome = "button" + this.id.toString();
			this.createCustomListener(eventToCall, nome, targetNode, args);

			this.delta = null;
			this.power = null;
			this.isGrabbed = false;
			this.touchId = null;
			this.normalImg = null;
			this.pressedImg = null;
			this.keyValue = null;

			this.clickInitialPosition = null;
			if (!cc.sys.isMobile) {
				this.isNative = false;
			}
			else{
				this.isNative = true;
			}

			this.setPosition(x,y);

			pd.setInputForButton(this);
			this.normalImg = cc.spriteFrameCache.getSpriteFrame(normalImage);
			this.pressedImg = cc.spriteFrameCache.getSpriteFrame(pressedImage);

			this.setSpriteFrame(this.normalImg);
			this.callUpEvent = false;
			this.forceCallUpEvent = false;
			return true;
		},
		setCallUpEvent:function(b){
			this.forceCallUpEvent = b;
		},
		//Define um botão do teclado para ativar o botão
		defineKey:function(intKeyValue){
			this.keyValue = intKeyValue;
		},

		onMouseDown:function(event){
			if(this.isNative){
				for(i in event){
					if(singletonTouchId[i] == false){
						var press = this.checkHitBox(event[i]);
						if(press){
							break;
						}
					}
				}
			}
			else{
				this.checkHitBox(event);
			}
		},
		checkHitBox:function(event){
			var position = event.getLocation();
			var tempBox = cc.rect(position.x, position.y, 1,1);
			if(cc.rectIntersectsRect(this.getBoundingBox(), tempBox)){
				if(this.isNative){
					this.touchId = event.getID();
				}
				this.setSpriteFrame(this.pressedImg);
				this.scaleReleased = this.getScale();
				if (this.scalePressed === undefined) {
					this.scalePressed = this.scaleReleased;
				}
				this.setScale(this.scalePressed);

				this.isGrabbed = true;
				this.callUpEvent = true;
				this.callCustomCallBack(true);
				return true;
			}
			return false;
		},
		onMouseUp:function(event){
			if(this.isNative){
				for(i in event){
					if(event[i].getID() == this.touchId && this.isGrabbed){
						this.setSpriteFrame(this.normalImg);
						this.setScale(this.scaleReleased);
						this.isGrabbed = false;
						if(this.callUpEvent || this.forceCallUpEvent)
							this.callCustomCallBack(false);

						this.callUpEvent = false;
					}
				}
			}
			else{
				if(this.isGrabbed){
					this.setSpriteFrame(this.normalImg);
					this.setScale(this.scaleReleased);
					if(this.callUpEvent || this.forceCallUpEvent)
						this.callCustomCallBack(false);

					this.callUpEvent = false;
					this.isGrabbed = false;
				}
			}

		},
		onMouseDragged:function(event){
			if(this.isNative){
				for(i in event){
					if(event[i].getID() == this.touchId && this.isGrabbed){
						var position = event[i].getLocation();
						var tempBox = cc.rect(position.x, position.y, 1,1);
						if(!cc.rectIntersectsRect(this.getBoundingBoxToWorld(), tempBox)){
							this.setSpriteFrame(this.normalImg);
							this.setScale(this.scaleReleased);
							this.callUpEvent = false;
						}
						else{
							this.setSpriteFrame(this.pressedImg);
							this.setScale(this.scalePressed);
							this.callUpEvent = true;
						}
					}
				}
			} else{
				if(this.isGrabbed){
					var position = event.getLocation();
					var tempBox = cc.rect(position.x, position.y, 1,1);
					if(!cc.rectIntersectsRect(this.getBoundingBox(), tempBox)){
						this.setSpriteFrame(this.normalImg);
						this.setScale(this.scaleReleased);
						this.callUpEvent = false;
					}
					else{
						this.setSpriteFrame(this.pressedImg);
						this.setScale(this.scalePressed);
						this.callUpEvent = true;
					}
				}
			}
		},
		keyDown:function(keyCode, event){
			// cc.log(keyCode);
			if(keyCode == this.keyValue){
				this.setSpriteFrame(this.pressedImg);
				this.callCustomCallBack(true);
			}
		},
		keyReleased:function(keyCode, event){
			if(keyCode == this.keyValue){
				this.setSpriteFrame(this.normalImg);
				this.callCustomCallBack(false);
			}
		},


		createCustomListener:function(CallBack, NomeDoEvento, target, funcArgs){
			this.funcToCall = CallBack;
			this.eventName = NomeDoEvento;
			this.funcCaller = target;
			this.funcArgs = funcArgs;
		},
		callCustomCallBack:function(isKeyDown){
			if(typeof(this.funcToCall) == "function") {
				this.runAction(new cc.CallFunc(this.funcToCall, this.funcCaller, isKeyDown));
			} else if(typeof(this.funcToCall) == "string") {
				this.funcCaller[this.funcToCall](this, isKeyDown, this.funcArgs);
			}
		},
		createCustomListenerBackup: function(CallBack, NomeDoEvento, target, removeCallBack){
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
					target.call(event.press);
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
		callCustomCallBackBackup: function(valor){
			if((this.eventName == null || this.eventName == undefined) && this.event != null && this.event != undefined){
				cc.log('eventName nulo ou undefined, init chamado apos criação do CustomCallBack sem o parametro false');
			}
			if(this.eventName != null && this.eventName != undefined) {
				var evento = new cc.EventCustom(this.eventName);
				evento.setUserData(this.callBack, valor);
				evento.press = valor;
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
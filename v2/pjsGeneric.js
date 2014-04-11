var colorPalette2 = {
	paletteObjs : [],
	selectedColor : '',
	create: function(params){		
		for(var x in params){
			var id=x, 
				clr=params[x].colors,
				ocs=params[x].onColorSelect, 
				pCnt=$n('#'+id);
				
			if(!clr){clr = this.colorMatrix()}
			this.paletteObjs.push(pCnt);
			pLayer=this.createLayer(id,pCnt,clr,ocs);
			$n('body').append(pLayer);
			(function(i,pC,pL,o){colorPalette2.handelShowHide(i,pC,pL,o)})(id,pCnt,pLayer,ocs);
		}
		window.onresize=function(){$n('.pLayer').removeClass('dspB')}
		$n('body').addEvent('click', function(event){
			var target = (event.target) ? event.target : event.srcElement, flg=false;
			for(var c=0;c<colorPalette2.paletteObjs.length;c++){if(colorPalette2.paletteObjs[c].attr('id')==target.id){flg=true}}
			if(!flg){$n('.pLayer').removeClass('dspB')}
		});
	},
	
	createLayer : function(id,obj,cols,ocs){
		var lay=$n('<div>');
		lay.attr('id',obj.attr('id')+'_lay');
		lay.addClass('pLayer');
		var pltUL=$n('<ul>');
		for(var x=0;x<cols.length;x++){
			var pltLI=$n('<li>');
			var pltA=$n('<a>');
			if(cols[x]=='none'){
				pltA.css({'background':'none'});
				pltA.html('N/A');
			}
			else{pltA.css({'background':cols[x]})}
			pltA.attr('href','javascript:void(0)');
			pltA.attr('rel',x);
			pltLI.append(pltA);
			pltUL.append(pltLI);
		}
		lay.append(pltUL);
		return lay;
	},
	
	handelShowHide : function(id,pCnt,pLayer,ocs){
		pCnt.addEvent('click',function(){colorPalette2.handelClick(id,this,pLayer,ocs)});
		pCnt.addEvent('keydown',function(e){colorPalette2.handelKey(e,id,this,pLayer,ocs)});
	},
	
	handelClick : function(parID,btn,lay,ocs){
		var btn=$n(btn),oPos=btn.position(),layers=$n('.pLayer'),f=false;
		(lay.hasClass('dspB')=='dspB')?f=true:f=false;
		layers.removeClass('dspB');
		if(f){lay.removeClass('dspB')}
		else{
			lay.addClass('dspB');
			lay.css({'left':oPos.left+'px'});
			lay.css({'top':oPos.top+btn.height()-1+'px'});
			var aBox=lay.childrens('a');
			aBox.each(function(){
				$n(this).currObj().onclick = function(){
					colorPalette2.handelPaletteClick($n(this),btn,parID,ocs)
				}
			})
		}
	},
	
	handelKey : function(e,parID,btn,lay){
		 var btn=$n(btn);
		var key;
		(e.which)?key=e.which:key=e.keyCode;
		if(key==40 && lay.hasClass('dspB')=='dspB'){
			var aBox=lay.childrens('a');
			this.handelHighlight(aBox.eq(0));
			for(var x=0;x<aBox.length;x++){
				aBox.eq(x).addEvent('keydown',function(e){colorPalette2.handelPaletteKey(e,this,aBox,parID,btn)});
			}
			this.preventDefaultAction(e);
		}
		else if(key==9 || key==27){
			var layers=$n('.pLayer');
			layers.removeClass('dspB');
		}
	},
	
	handelPaletteKey : function(e,obj,aBox,parID,btn){
		var o=$n(obj);
		var indx=parseInt(o.attr('rel'));
		var key;
		(e.which)?key=e.which:key=e.keyCode;
		if(key==27){
			btn.setFocus();
			var layers=$n('.pLayer');
			layers.removeClass('dspB');
		}
		else if(key == 37){
			if(indx-1<0){this.handelHighlight(aBox.eq(aBox.length-1))}
			else{this.handelHighlight(aBox.eq(indx-1))}
			this.preventDefaultAction(e);
		}
		else if(key == 38){
			if(indx-6<0){
				var i = (6*Math.ceil((aBox.length)/6)+(indx-6));
				if(i>aBox.length-1){this.handelHighlight(aBox.eq(i-6))}
				else{this.handelHighlight(aBox.eq(i))}
			}
			else{this.handelHighlight(aBox.eq(indx-6))}
			this.preventDefaultAction(e);
		}
		else if(key == 39){
			if(indx+1>aBox.length-1){this.handelHighlight(aBox.eq(0))}
			else{this.handelHighlight(aBox.eq(indx+1))}
			this.preventDefaultAction(e);
		}
		else if(key == 40){
			if(indx+6<aBox.length){this.handelHighlight(aBox.eq(indx+6))}
			else{var i=indx%6;this.handelHighlight(aBox.eq(i))}
			this.preventDefaultAction(e);
		}
		else if(key===9){
			if(e.shiftKey){
				if(indx==0){
					this.preventDefaultAction(e);
					indx=aBox.length-1;
					this.handelHighlight(aBox.eq(indx))
				}
				else{this.handelHighlight(aBox.eq(indx),aBox.eq(indx-1))}
			}
			else{
				if(indx==aBox.length-1){
					this.preventDefaultAction(e);
					indx=0;
					this.handelHighlight(aBox.eq(indx))
				}
				else{this.handelHighlight(aBox.eq(indx),aBox.eq(indx+1))}
			}
       }
	   else if(key == 32){
		   	aBox.eq(indx).currObj().click();
			this.preventDefaultAction(e);
		}
	},
	
	handelPaletteClick : function(pltA,obj,parID,ocs){
		var c=pltA.currObj().style.backgroundColor;
		obj.css({'background':c});
		var layers=$n('.pLayer');
		layers.removeClass('dspB');
		this.changeColor(c);
		ocs({obj:obj,colorCode:colorPalette2.selectedColor});
		obj.setFocus();
	},
	
	changeColor : function(c){
		colorPalette2.selectedColor=this.rgbToHex(c)
	},
	
	preventDefaultAction : function(e){
			if(e.preventDefault){e.preventDefault()}
            if(e.stopPropagation){e.stopPropagation()}
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
	},
	
	handelHighlight : function(obj,hB){
		if(hB){
			(hB.hasClass('sel')=='sel')?'':hB.addClass('sel');
			hB.addEvent('blur',function(){hB.removeClass('sel')})
		}
		else{
			obj.setFocus();
			(obj.hasClass('sel')=='sel')?'':obj.addClass('sel');
			obj.addEvent('blur',function(){obj.removeClass('sel')})
		}
	},
	
	rgbToHex : function (c) {
		if(c=='none' || c.substr(0, 1)==='#'){return c}
		var codes = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(c), r = parseInt(codes[2]), g = parseInt(codes[3]), b = parseInt(codes[4]);
		var rgb = b | (g << 8) | (r << 16);
		return codes[1] + '#' + (0x1000000 | rgb).toString(16).substring(1);
	},
	
	colorMatrix : function(){
		var i,j,k,clrs = [],bC=new Array('00','99','ff');
		for(i=0;i<3;i++){
		 for(j=0;j<3;j++){	
		   for(k=0;k<3;k++){
			clrs.push('#'+bC[i]+bC[j]+bC[k]);
		   }
		 }
		}
		return clrs;
	}
}
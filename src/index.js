import React, { Component } from 'react';
import Bar from './bar';
import './os.css';
export default class Content extends Component {
    constructor() {
		super();
		this.content = null;
		this.timer 	 = null;
		this.state = {
			// content wrap
			sH         : 0,
			cH         : 0,

			// content
			contenTop  : 0,

			// Bar
			barTop     : 0,
			barHeight  : 0,
			barRatio   : 1,
			dragStart  : 0,
			dragEnd    : 0,
			clickBarTop: 0,
			isDrag     : false,
			barFade    : true
		}
	}

	componentDidMount() {
		this.barInit();
	}

	wheel = (e)=>{
		let {sH,cH,barHeight,contenTop} = this.state;
		let barRatio = sH / cH;
		let barTop	 = e.deltaY / barRatio + this.state.barTop;
		let barFade	 = false
		contenTop += e.deltaY;
		if(barTop<=0) {
			barTop    = 0;
			contenTop = 0;
		} else if(barTop + barHeight >cH) {
			barTop    = cH - barHeight;
			contenTop = sH - cH;
		}
		this.setState({barTop,contenTop,barFade,barRatio});
		this.fadeBar();
	}

	fadeBar = ()=>{
		window.clearTimeout(this.timer);
		this.timer = setTimeout(()=>{
			this.setState({
				barFade:true
			})
		},1000);
	}
	
	eventStop = (e)=>{
		if(e.cancelable && !e.defaultPrevented) {
            e.preventDefault();
        }
        e.stopPropagation();
	}

	barMouseOver = (e)=>{
		this.eventStop(e);
		let {isDrag} = this.state;	
		if(isDrag) return;	
		this.setState({
			barFade:false
		})
	}

	barMouseLeave = (e)=>{
		this.eventStop(e);
		let {isDrag} = this.state;	
		if(isDrag) return;	
		this.setState({
			barFade:true
		})
	}

	barMouseDown = (e)=>{
		this.eventStop(e);		
		this.setState({
			dragStart  : e.screenY,
			isDrag     : true,
			clickBarTop: this.state.barTop
		});
	}
	barMouseMove = (e)=>{
		this.eventStop(e);		
		let {dragStart,barRatio,isDrag,barHeight,cH,sH,clickBarTop} = this.state;
		if(!isDrag) return;
		let step      = (e.screenY - dragStart) + clickBarTop;
		let contenTop = step*barRatio;
		if(step<=0) {
			step      = 0;
			contenTop = 0;
		} else if(step + barHeight >cH) {
			step      = cH - barHeight;
			contenTop = sH - cH;
		}
		this.setState({
			barTop:step,
			contenTop,
		})
	}
	barMouseUp =  (e)=>{
		if(e.cancelable && !e.defaultPrevented) {
            e.preventDefault();
        }
        e.stopPropagation();
		this.setState({
			isDrag:false
		})
	}

	barInit = ()=>{
		let {contenTop} = this.state;
		let c	        = this.content;
		let cH	        = c.clientHeight;
		let sH	        = c.scrollHeight<c.clientHeight?c.clientHeight: c.scrollHeight;
		let barHeight   = cH / (sH/cH) < cH/5 ?cH/5                   : cH / (sH/cH);
		let barTop      = ((contenTop + cH) / sH )*cH - barHeight;
		if(barTop < 0) {
			barTop    = 0;
			contenTop =  0;
		} else if(barTop + barHeight> cH){
			barTop    = cH - barHeight;
			contenTop = sH - cH;
		}
		
		this.setState({
			sH,
			cH,
			barHeight,
			barTop,
			contenTop
		})
	}

	componentDidUpdate() {
		if(this.state.isDrag) {
            document.addEventListener('mousemove', this.barMouseMove);
            document.addEventListener('mouseup', this.barMouseUp);
        } else {
            document.removeEventListener('mousemove', this.barMouseMove);
            document.removeEventListener('mouseup', this.barMouseUp);
        }
	}
	
	componentWillReceiveProps (nextProps) {
		setTimeout(()=>{
			this.barInit();
		},200);
	}

	

	render() {
        let {contenTop,barTop,barHeight,barFade,isDrag} = this.state;
        let {showBar} = this.props;
		let barStyle     = {
			top       : barTop,
			height    : barHeight,
			background: barFade?'rgba(47, 47, 47,0.4)': '',
			isDrag    : isDrag
		};
		let contentStyle = {
			transform : `translateY(${-contenTop||0}px)`,
			transition: isDrag?'none': '',
		};
		let barMethod    = {
			barMouseOver : this.barMouseOver,
			barMouseLeave: this.barMouseLeave,
			barMouseDown : this.barMouseDown,
		}
		return (
			<div className="s-content" onWheel={this.wheel} ref={(ref)=>{this.content = ref}}>
                {showBar?<Bar method={barMethod} style={barStyle} />:''}
                <div className="s-c" style={contentStyle}>
                    {this.props.children||null}
                </div>
			</div>
		);
	}
}
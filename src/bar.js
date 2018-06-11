import React, { Component,PureComponent} from 'react';

export default class Bar extends PureComponent {
    constructor() {
        super()
    }
    render() {
        let method    = this.props.method;
        let style     = {
            transform : `translateY(${this.props.style.top||0}px)`,
            height    : `${this.props.style.height||10}px`,
            background: this.props.style.background,
            transition: this.props.style.isDrag?'none': ''
        };
        return (
        <div className="s-bar">
                <div
                    onMouseOver  = {method.barMouseOver}
                    onMouseLeave = {method.barMouseLeave}
                    onMouseDown  = {method.barMouseDown}
                    onMouseUp    = {method.barMouseUp}
                    onMouseMove  = {method.barMouseMove}
                    className    = 's-l-bar' 
                    style        = {style}>
                </div>
        </div>)
    }
}
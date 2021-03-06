/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
export class DividerLayoutBehavior extends Behavior {
	onAdapt(layout) {
		var divider = layout.last;
		divider.behavior.divide(divider);
	}
	onDisplaying(layout) {
		var divider = layout.last;
		divider.behavior.divide(divider);
	}
};

class DividerBehavior extends Behavior {
	onCreate(divider, data, dictionary) {
		this.after = ("after" in dictionary) ? dictionary.after : 0;
		this.before = ("before" in dictionary) ? dictionary.before : 0;
		this.current = ("current" in dictionary) ? dictionary.current : 0;
		this.status = ("status" in dictionary) ? dictionary.status : false;
	}
	onTouchEnded(divider, id, x, y, ticks) {
		var container = divider.container;
		var current = this.measure(divider);
		this.status = (this.direction > 0) ? this.before != current : this.after != current;
		if (this.status)
			this.current = current;
		shell.distribute("onDividerChanged", divider);
	}
};

export class HorizontalDividerBehavior extends DividerBehavior {
	divide(divider) {
		var layout = divider.container;
		var height = divider.height >> 1;
		var top = divider.y + height - layout.y;
		var bottom = layout.height - top;
		if (top < this.before) {
			top = this.before;
			bottom = layout.height - top;
		}
		if (bottom < this.after) {
			bottom = this.after;
			top = layout.height - bottom;
		}
		divider.y = layout.y + top - height;
		divider.previous.previous.height = top;
		divider.previous.height = bottom;
	}
	measure(divider) {
		var layout = divider.container;
		var height = divider.height >> 1;
		if (this.direction > 0)
			return divider.y + height - layout.y;
		return (layout.y + layout.height) - (divider.y + height);
	}
	onCreate(divider, data, dictionary) {
		super.onCreate(divider, data, dictionary);
		this.direction = ("top" in dictionary) ? 1 : -1;
	}
	onMouseEntered(divider, x, y) {
		shell.behavior.cursorShape = system.cursors.resizeNS;
	}
	onTouchBegan(divider, id, x, y, ticks) {
		this.anchor = y - divider.y;
		this.status = true;
	}
	onTouchMoved(divider, id, x, y, ticks) {
		divider.y = y - this.anchor;
		this.divide(divider);
	}
	toggle(divider) {
		var layout = divider.container;
		var height = divider.height >> 1;
		if (this.status) {
			this.status = false;
			divider.y = (layout.y + layout.height) - (this.after + height);
		}
		else {
			this.status = true;
			divider.y = (layout.y + layout.height) - (this.current + height);
		}
		this.divide(divider);
		shell.distribute("onDividerChanged", divider);
	}
};

export var HorizontalDivider = Container.template($ => ({
	left:0, right:0, height:6, active:true, Behavior:HorizontalDividerBehavior,
}));

export class VerticalDividerBehavior extends DividerBehavior {
	divide(divider) {
		var layout = divider.container;
		var width = divider.width >> 1;
		var left = divider.x + width - layout.x;
		var right = layout.width - left;
		if (left < this.before) {
			left = this.before;
			right = layout.width - left;
		}
		if (right < this.after) {
			right = this.after;
			left = layout.width - right;
		}
		divider.x = layout.x + left - width;
		divider.previous.previous.width = left;
		divider.previous.width = right;
	}
	measure(divider) {
		var layout = divider.container;
		var width = divider.width >> 1;
		if (this.direction > 0)
			return divider.x + width - layout.x;
		return (layout.x + layout.width) - (divider.x + width);
	}
	onCreate(divider, data, dictionary) {
		super.onCreate(divider, data, dictionary);
		this.direction = ("left" in dictionary) ? 1 : -1;
	}
	onMouseEntered(divider, x, y) {
		shell.behavior.cursorShape = system.cursors.resizeEW;
	}
	onTouchBegan(divider, id, x, y, ticks) {
		this.anchor = x - divider.x;
	}
	onTouchMoved(divider, id, x, y, ticks) {
		divider.x = x - this.anchor;
		this.divide(divider);
	}
	toggle(divider) {
		var layout = divider.container;
		var width = divider.width >> 1;
		if (this.status) {
			this.status = false;
			divider.x = (layout.x + layout.width) - (this.after + width);
		}
		else {
			this.status = true;
			divider.x = (layout.x + layout.width) - (this.current + width);
		}
		this.divide(divider);
		shell.distribute("onDividerChanged", divider);
	}
};

export var VerticalDivider = Container.template($ => ({
	 width:6, top:0, bottom:0, active:true, Behavior:VerticalDividerBehavior 
 }));


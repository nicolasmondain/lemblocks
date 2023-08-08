import './main.html';

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session'

import {BlocksCollection} from '../imports/api/BlocksCollection';

const DEFAULT_COLORS       = ['red', 'blue', 'green', 'yellow'];
const DEFAULT_DRAG         = false;
const DEFAULT_SIZE         = 1;
const DEFAULT_TRANSPARENCY = 0.5;
const DEFAULT_BLOCK        = {

	color       : DEFAULT_COLORS[0],
	x           : 0,
	y           : 0,
	z           : 0,
	size        : [DEFAULT_SIZE, DEFAULT_SIZE, DEFAULT_SIZE],
	transparency: DEFAULT_TRANSPARENCY,
	alphaMode   : 'AUTO' // AUTO|OPAQUE|MASK|BLEND

};

// https://www.x3dom.org/
// https://doc.x3dom.org/author/index.html
// https://doc.x3dom.org/developer/x3dom/nodeTypes/PhysicalMaterial.html
// The transparency field specifies how "clear" an object is, with 1.0 being completely transparent, and 0.0 completely opaque.

const STRUCTURE_X	= 10;
const STRUCTURE_Y	= 10;
const STRUCTURE_Z	= 10;
const COUNT			  = STRUCTURE_X * STRUCTURE_Y * STRUCTURE_Z;

let x = 0;
let y = 0;
let z = 0;

const STRUCTURE = [...Array(COUNT).keys()].map((e, i) => {

	if(i % (STRUCTURE_X * STRUCTURE_Z) === 0){

		z += 1;
		y  = 0;
		x  = 0;

	}else if(i % STRUCTURE_X === 0){

		y += 1;
		x  = 0;

	}else{

		x += 1;

	}

	return Object.assign({}, DEFAULT_BLOCK, {x, y, z});

});

if(Meteor.isClient){

	Session.set('color', DEFAULT_COLORS[0]);
	Session.set('drag', DEFAULT_DRAG);

	Template.appBlock.onCreated(function(){

		this.subscribe('blocks');

	});

	Template.appBlock.helpers({

		blocks: () => BlocksCollection.find(),
		colors: DEFAULT_COLORS,
		isChecked(color){

			return color === Session.get('color') ? 'checked' : '';

		}

	});

	Template.appBlock.events({

		'click input[type=radio]'(event){

			const input = event.currentTarget;
			const color = input.value;

			Session.set('color', color);

		},
		'click input[type=range]#transparency'(event){

			const input        = event.currentTarget;
			const transparency = input.value;

			Session.set('transparency', transparency);

			const blocks = BlocksCollection.find();

			blocks.forEach((block) => {

				BlocksCollection.update(block._id, {$set: {transparency}});

			});

		},
		'mousedown shape[data-type="box"]'(){},
		'mousedown x3d'(){

			Session.set('drag', false);

		},
		'mousemove x3d'(){

			Session.set('drag', true);

		},
		'mouseup shape'(event){

			if(!Session.get('drag') && event.button === 1){

				const block = {

					color       : Session.get('color'),
					transparency: Session.get('transparency'),
					x           : Math.floor(event.worldX + event.normalX / 2) + 0.5,
					y           : Math.floor(event.worldY + event.normalY / 2) + 0.5,
					z           : Math.floor(event.worldZ + event.normalZ / 2) + 0.5

				};

				BlocksCollection.insert(block);

			}else if(!Session.get('drag') && event.button === 2){

				const block = event.currentTarget;
				const id    = block.getAttribute('data-id');

				if(id){

					BlocksCollection.remove(id);

				}

			}

		}

	});

}

if(Meteor.isServer){

}

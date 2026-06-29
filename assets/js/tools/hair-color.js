/** Hair Color Matcher — flattering colours from skin tone + undertone. */
( function () {
	'use strict';
	var MAP = {
		'fair|cool': [ 'Ash blonde', 'Platinum', 'Cool light brown', 'Burgundy' ],
		'fair|warm': [ 'Golden blonde', 'Honey', 'Strawberry blonde', 'Light golden brown' ],
		'light|cool': [ 'Ash brown', 'Cool blonde', 'Espresso', 'Plum' ],
		'light|warm': [ 'Caramel', 'Honey brown', 'Golden copper', 'Warm chestnut' ],
		'medium|cool': [ 'Cool chestnut', 'Ash brown', 'Mahogany', 'Cool black' ],
		'medium|warm': [ 'Chocolate brown', 'Caramel highlights', 'Auburn', 'Warm copper' ],
		'olive|cool': [ 'Deep espresso', 'Cool dark brown', 'Blue-black', 'Soft plum' ],
		'olive|warm': [ 'Golden brown', 'Honey caramel', 'Warm auburn', 'Bronze' ],
		'deep|cool': [ 'Jet black', 'Cool dark brown', 'Deep burgundy', 'Espresso' ],
		'deep|warm': [ 'Warm black', 'Dark chocolate', 'Rich auburn', 'Mahogany' ]
	};
	GMT.register( 'hair-color', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			function sel( opts ) { var s = h.el( 'select', { 'class': 'gmt-select' } ); opts.forEach( function ( o ) { s.appendChild( h.el( 'option', { value: o, text: o.charAt( 0 ).toUpperCase() + o.slice( 1 ) } ) ); } ); return s; }
			var tone = sel( [ 'fair', 'light', 'medium', 'olive', 'deep' ] );
			var under = sel( [ 'cool', 'warm' ] );
			form.appendChild( h.field( 'Skin tone', tone ) );
			form.appendChild( h.field( 'Undertone', under, 'Cool = pink/blue · Warm = golden/peach' ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: 'Match my colours', onClick: calc, style: 'margin-top:8px' } ) );

			function calc() {
				var list = MAP[ tone.value + '|' + under.value ] || [];
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Flattering hair colours for you' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, list.map( function ( c ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, h.el( 'b', { style: 'font-size:1rem', text: c } ) ); } ) ),
					h.el( 'p', { 'class': 'hint', text: 'Generally, cool undertones suit ashy/cool shades and warm undertones suit golden/copper shades.' } )
				] ) );
			}
		}
	} );
} )();

/** Makeup Shade Finder — undertone + depth → foundation guidance. */
( function () {
	'use strict';
	GMT.register( 'makeup-shade', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			function sel( opts ) { var s = h.el( 'select', { 'class': 'gmt-select' } ); opts.forEach( function ( o ) { s.appendChild( h.el( 'option', { value: o[ 1 ], text: o[ 0 ] } ) ); } ); return s; }

			var veins = sel( [ [ 'Blue or purple', 'cool' ], [ 'Green', 'warm' ], [ 'Both / hard to tell', 'neutral' ] ] );
			var jewel = sel( [ [ 'Silver', 'cool' ], [ 'Gold', 'warm' ], [ 'Both suit me', 'neutral' ] ] );
			var sun = sel( [ [ 'I burn easily', 'cool' ], [ 'I tan easily', 'warm' ], [ 'A bit of both', 'neutral' ] ] );
			var depth = sel( [ [ 'Fair', 'Fair' ], [ 'Light', 'Light' ], [ 'Medium', 'Medium' ], [ 'Tan', 'Tan' ], [ 'Deep', 'Deep' ] ] );

			form.appendChild( h.field( 'Veins on your wrist look…', veins ) );
			form.appendChild( h.field( 'Which jewellery flatters you?', jewel ) );
			form.appendChild( h.field( 'In the sun your skin…', sun ) );
			form.appendChild( h.field( 'Your skin depth', depth ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: 'Find my shade', onClick: calc, style: 'margin-top:8px' } ) );

			var ADVICE = {
				cool: 'pink, red or blue undertones — look for shades labelled “cool”, “rose” or “porcelain”.',
				warm: 'yellow, golden or peach undertones — look for shades labelled “warm”, “golden” or “honey”.',
				neutral: 'a balanced mix — look for shades labelled “neutral” or “beige”.'
			};
			function calc() {
				var tally = { cool: 0, warm: 0, neutral: 0 };
				[ veins, jewel, sun ].forEach( function ( s ) { tally[ s.value ]++; } );
				var under = Object.keys( tally ).sort( function ( a, b ) { return tally[ b ] - tally[ a ]; } )[ 0 ];
				var uName = under.charAt( 0 ).toUpperCase() + under.slice( 1 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your recommended foundation' } ),
					h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.7rem', text: depth.value + ' · ' + uName + ' undertone' } ),
					h.el( 'p', { text: 'You likely have ' + ADVICE[ under ] } ),
					h.el( 'p', { 'class': 'hint', text: 'Always swatch on your jaw in natural light — it should disappear into your skin.' } )
				] ) );
			}
		}
	} );
} )();

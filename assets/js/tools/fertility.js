/** Fertility Window Calculator — best days to conceive. */
( function () {
	'use strict';
	GMT.register( 'fertility', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var last = h.el( 'input', { type: 'date', 'class': 'gmt-input', max: new Date().toISOString().slice( 0, 10 ) } );
			var cycle = h.el( 'input', { type: 'number', min: '20', max: '45', 'class': 'gmt-input', value: '28' } );
			form.appendChild( h.field( 'First day of last period', last ) );
			form.appendChild( h.field( 'Cycle length (days)', cycle ) );

			function fmt( d ) { return d.toLocaleDateString( undefined, { weekday: 'short', month: 'short', day: 'numeric' } ); }
			function calc() {
				if ( ! last.value ) { result.innerHTML = ''; return; }
				var c = parseInt( cycle.value, 10 ) || 28;
				var base = new Date( last.value );
				var ov = new Date( base ); ov.setDate( ov.getDate() + ( c - 14 ) );
				var days = [];
				for ( var d = -5; d <= 1; d++ ) { var x = new Date( ov ); x.setDate( x.getDate() + d ); days.push( { d: x, peak: d >= -1 && d <= 0 } ); }
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your fertile window (best days to conceive)' } ),
					h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.5rem', text: fmt( days[ 0 ].d ) + ' – ' + fmt( days[ 6 ].d ) } ),
					h.el( 'p', { 'class': 'hint', text: 'Peak fertility is around ovulation: ' + fmt( new Date( ov.getTime() - 86400000 ) ) + ' – ' + fmt( ov ) + '. Intercourse during these days gives the best chance of conception.' } )
				] ) );
			}
			[ last, cycle ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

/** Ovulation Calculator — ovulation day + fertile window. */
( function () {
	'use strict';
	GMT.register( 'ovulation', {
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
				var fStart = new Date( ov ); fStart.setDate( fStart.getDate() - 5 );
				var fEnd = new Date( ov ); fEnd.setDate( fEnd.getDate() + 1 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Estimated ovulation day' } ),
					h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.7rem', text: fmt( ov ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: 'Fertile window' } ), h.el( 'b', { style: 'font-size:.95rem', text: fmt( fStart ) + ' – ' + fmt( fEnd ) } ) ] ),
						h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: 'Most fertile' } ), h.el( 'b', { style: 'font-size:.95rem', text: fmt( new Date( ov.getTime() - 86400000 ) ) + ' – ' + fmt( ov ) } ) ] )
					] )
				] ) );
			}
			[ last, cycle ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

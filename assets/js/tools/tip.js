/** Tip Calculator — tip, total and per-person split. */
( function () {
	'use strict';
	GMT.register( 'tip', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var bill = h.el( 'input', { type: 'number', min: '0', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', placeholder: '50.00' } );
			var pct = h.el( 'input', { type: 'number', min: '0', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', value: '15' } );
			var people = h.el( 'input', { type: 'number', min: '1', step: '1', inputmode: 'numeric', 'class': 'gmt-input', value: '1' } );

			form.appendChild( h.field( 'Bill amount', bill ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Tip %', pct ), h.field( 'Split between (people)', people ) ] ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var b = parseFloat( bill.value ), p = parseFloat( pct.value ), n = parseInt( people.value, 10 );
				if ( ! ( b >= 0 ) || ! ( p >= 0 ) ) { result.innerHTML = ''; return; }
				n = ( n >= 1 ) ? n : 1;
				var tip = b * p / 100, total = b + tip;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Total to pay' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( total, 2 ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Tip amount', h.num( tip, 2 ) ),
						cell( 'Per person', h.num( total / n, 2 ) ),
						cell( 'Tip per person', h.num( tip / n, 2 ) ),
						cell( 'Bill per person', h.num( b / n, 2 ) )
					] )
				] ) );
			}
			[ bill, pct, people ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

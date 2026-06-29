/** Discount Calculator — sale price and savings. */
( function () {
	'use strict';
	GMT.register( 'discount', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var price = h.el( 'input', { type: 'number', min: '0', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', placeholder: '100.00' } );
			var disc = h.el( 'input', { type: 'number', min: '0', max: '100', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', placeholder: '20' } );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Original price', price ), h.field( 'Discount %', disc ) ] ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var p = parseFloat( price.value ), d = parseFloat( disc.value );
				if ( ! ( p >= 0 ) || ! ( d >= 0 ) ) { result.innerHTML = ''; return; }
				var save = p * d / 100, final = p - save;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'You pay' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( final, 2 ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'You save', h.num( save, 2 ) ),
						cell( 'Discount', h.num( d, 2 ) + '%' )
					] )
				] ) );
			}
			[ price, disc ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

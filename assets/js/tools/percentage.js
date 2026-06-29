/** Percentage Calculator — three common modes, all live. */
( function () {
	'use strict';
	GMT.register( 'percentage', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;

			function block( title, a, b, fn ) {
				var i1 = h.el( 'input', { type: 'number', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', placeholder: '0' } );
				var i2 = h.el( 'input', { type: 'number', step: 'any', inputmode: 'decimal', 'class': 'gmt-input', placeholder: '0' } );
				var out = h.el( 'div', { 'class': 'gmt-result__big', text: '—' } );
				function run() {
					var x = parseFloat( i1.value ), y = parseFloat( i2.value );
					out.textContent = ( isNaN( x ) || isNaN( y ) ) ? '—' : fn( x, y );
				}
				i1.addEventListener( 'input', run ); i2.addEventListener( 'input', run );
				return h.el( 'div', { 'class': 'gmt-result', style: 'margin-top:14px' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: title } ),
					h.el( 'div', { 'class': 'gmt-row gmt-row--2', style: 'margin:10px 0' }, [ h.field( a, i1 ), h.field( b, i2 ) ] ),
					out
				] );
			}

			form.appendChild( block( 'What is X% of Y?', 'Percent (X)', 'Value (Y)', function ( x, y ) {
				return h.num( ( x / 100 ) * y, 2 );
			} ) );
			form.appendChild( block( 'X is what percent of Y?', 'Value (X)', 'Total (Y)', function ( x, y ) {
				return y === 0 ? '—' : h.num( ( x / y ) * 100, 2 ) + '%';
			} ) );
			form.appendChild( block( 'Percentage change from X to Y', 'From (X)', 'To (Y)', function ( x, y ) {
				if ( x === 0 ) { return '—'; }
				var c = ( ( y - x ) / Math.abs( x ) ) * 100;
				return ( c >= 0 ? '+' : '' ) + h.num( c, 2 ) + '%';
			} ) );
		}
	} );
} )();

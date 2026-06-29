/** Loan Calculator — monthly repayment, total interest & cost. */
( function () {
	'use strict';
	GMT.register( 'loan', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var amount = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '20000' } );
			var rate = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '6.0' } );
			var years = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '4' } );

			form.appendChild( h.field( 'Loan amount', amount ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Annual interest rate (%)', rate ), h.field( 'Term (years)', years ) ] ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var p = parseFloat( amount.value ), ar = parseFloat( rate.value ), y = parseFloat( years.value );
				if ( ! ( p > 0 ) || ! ( y > 0 ) || isNaN( ar ) ) { result.innerHTML = ''; return; }
				var n = Math.round( y * 12 ), r = ar / 12 / 100, pay;
				pay = ( r === 0 ) ? p / n : p * r * Math.pow( 1 + r, n ) / ( Math.pow( 1 + r, n ) - 1 );
				var total = pay * n, interest = total - p;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Monthly repayment' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( pay, 2 ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Total interest', h.num( interest, 2 ) ),
						cell( 'Total cost', h.num( total, 2 ) ),
						cell( 'Number of payments', h.num( n, 0 ) ),
						cell( 'Interest as % of loan', h.num( interest / p * 100, 1 ) + '%' )
					] )
				] ) );
			}
			[ amount, rate, years ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

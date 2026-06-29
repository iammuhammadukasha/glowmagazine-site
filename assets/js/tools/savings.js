/** Savings Calculator — compound growth with monthly contributions. */
( function () {
	'use strict';
	GMT.register( 'savings', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var initial = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '1000' } );
			var monthly = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '200' } );
			var rate = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '5' } );
			var years = h.el( 'input', { type: 'number', min: '0', step: 'any', 'class': 'gmt-input', placeholder: '10' } );

			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Initial amount', initial ), h.field( 'Monthly contribution', monthly ) ] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Annual interest rate (%)', rate ), h.field( 'Years', years ) ] ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var p = parseFloat( initial.value ) || 0, pmt = parseFloat( monthly.value ) || 0, ar = parseFloat( rate.value ), y = parseFloat( years.value );
				if ( ! ( y > 0 ) || isNaN( ar ) || ( p === 0 && pmt === 0 ) ) { result.innerHTML = ''; return; }
				var n = Math.round( y * 12 ), i = ar / 12 / 100, fv;
				if ( i === 0 ) { fv = p + pmt * n; }
				else { fv = p * Math.pow( 1 + i, n ) + pmt * ( ( Math.pow( 1 + i, n ) - 1 ) / i ); }
				var contributed = p + pmt * n, earned = fv - contributed;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Future balance' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( fv, 2 ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Total contributed', h.num( contributed, 2 ) ),
						cell( 'Interest earned', h.num( earned, 2 ) )
					] )
				] ) );
			}
			[ initial, monthly, rate, years ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

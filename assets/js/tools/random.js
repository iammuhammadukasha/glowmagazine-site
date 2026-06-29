/** Random Number Generator — range, count, optional unique. */
( function () {
	'use strict';
	GMT.register( 'random', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var min = h.el( 'input', { type: 'number', step: '1', inputmode: 'numeric', 'class': 'gmt-input', value: '1' } );
			var max = h.el( 'input', { type: 'number', step: '1', inputmode: 'numeric', 'class': 'gmt-input', value: '100' } );
			var count = h.el( 'input', { type: 'number', step: '1', min: '1', inputmode: 'numeric', 'class': 'gmt-input', value: '1' } );
			var uniq = h.el( 'input', { type: 'checkbox' } );

			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Minimum', min ), h.field( 'Maximum', max ) ] ) );
			form.appendChild( h.field( 'How many numbers', count ) );
			form.appendChild( h.el( 'label', { 'class': 'gmt-check' }, [ uniq, document.createTextNode( ' No duplicates (unique)' ) ] ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: '🎲 Generate', onClick: gen, style: 'margin-top:14px' } ) );

			function rnd( lo, hi ) { return Math.floor( Math.random() * ( hi - lo + 1 ) ) + lo; }
			function gen() {
				var lo = parseInt( min.value, 10 ), hi = parseInt( max.value, 10 ), n = parseInt( count.value, 10 );
				result.innerHTML = '';
				if ( isNaN( lo ) || isNaN( hi ) || isNaN( n ) || n < 1 ) { return; }
				if ( lo > hi ) { var t = lo; lo = hi; hi = t; }
				var range = hi - lo + 1, out = [];
				if ( uniq.checked ) {
					if ( n > range ) { result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Range too small for ' + n + ' unique numbers.' } ) ); return; }
					var pool = {};
					while ( out.length < n ) { var v = rnd( lo, hi ); if ( ! pool[ v ] ) { pool[ v ] = 1; out.push( v ); } }
				} else {
					for ( var i = 0; i < n; i++ ) { out.push( rnd( lo, hi ) ); }
				}
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Result' } ),
					h.el( 'div', { 'class': n === 1 ? 'gmt-result__big' : '', style: 'font-size:1.3rem;font-weight:700;word-break:break-word', text: out.join( ', ' ) } )
				] ) );
			}
			gen();
		}
	} );
} )();

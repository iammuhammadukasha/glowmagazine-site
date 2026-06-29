/** Sugar Intake Calculator — recommended daily added-sugar limit. */
( function () {
	'use strict';
	GMT.register( 'sugar', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var sex = 'female';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var f = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Female' } );
			var m = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Male' } );
			seg.appendChild( f ); seg.appendChild( m );
			f.addEventListener( 'click', function () { sex = 'female'; f.setAttribute( 'aria-pressed', 'true' ); m.setAttribute( 'aria-pressed', 'false' ); calc(); } );
			m.addEventListener( 'click', function () { sex = 'male'; m.setAttribute( 'aria-pressed', 'true' ); f.setAttribute( 'aria-pressed', 'false' ); calc(); } );
			var cals = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', placeholder: '2000' } );

			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Sex' } ), seg ] ) );
			form.appendChild( h.field( 'Daily calories (optional)', cals, 'For the WHO 10%-of-calories guideline.' ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var aha = sex === 'male' ? 36 : 25; // grams added sugar (AHA)
				var cells = [ cell( 'AHA daily limit', aha + ' g (' + Math.round( aha / 4 ) + ' tsp)' ) ];
				var c = parseFloat( cals.value );
				if ( c > 0 ) {
					cells.push( cell( 'WHO < 10% of calories', Math.round( c * 0.10 / 4 ) + ' g' ) );
					cells.push( cell( 'WHO ideal < 5%', Math.round( c * 0.05 / 4 ) + ' g' ) );
				}
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Recommended added-sugar limit' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: aha + ' g/day' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, cells )
				] ) );
			}
			cals.addEventListener( 'input', calc );
			calc();
		}
	} );
} )();

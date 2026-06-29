/** Fat Intake Calculator — daily fat grams from calories. */
( function () {
	'use strict';
	var RATIOS = { 'Lower fat (20%)': 20, 'Moderate (25%)': 25, 'Balanced (30%)': 30, 'Higher fat (35%)': 35 };
	GMT.register( 'fat', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var cals = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', placeholder: '2000' } );
			var ratio = h.el( 'select', { 'class': 'gmt-select' } );
			Object.keys( RATIOS ).forEach( function ( k, i ) { ratio.appendChild( h.el( 'option', { value: String( RATIOS[ k ] ), text: k, selected: i === 2 ? 'selected' : null } ) ); } );
			form.appendChild( h.field( 'Daily calories (kcal)', cals ) );
			form.appendChild( h.field( 'Share of calories from fat', ratio ) );
			function calc() {
				var c = parseFloat( cals.value );
				if ( ! ( c > 0 ) ) { result.innerHTML = ''; return; }
				var g = c * ( parseFloat( ratio.value ) / 100 ) / 9;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Daily fat target' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: Math.round( g ) + ' g' } ),
					h.el( 'p', { 'class': 'hint', text: 'At ' + ratio.value + '% of ' + h.num( c, 0 ) + ' kcal (9 kcal per gram of fat). Dietary guidelines suggest 20–35% of calories from fat.' } )
				] ) );
			}
			cals.addEventListener( 'input', calc ); ratio.addEventListener( 'change', calc );
		}
	} );
} )();

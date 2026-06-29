/** Carb Intake Calculator — daily carbohydrate grams from calories. */
( function () {
	'use strict';
	var RATIOS = { 'Low carb (25%)': 25, 'Moderate (45%)': 45, 'Balanced (50%)': 50, 'High carb (60%)': 60 };
	GMT.register( 'carb', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var cals = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', placeholder: '2000' } );
			var ratio = h.el( 'select', { 'class': 'gmt-select' } );
			Object.keys( RATIOS ).forEach( function ( k, i ) { ratio.appendChild( h.el( 'option', { value: String( RATIOS[ k ] ), text: k, selected: i === 2 ? 'selected' : null } ) ); } );
			form.appendChild( h.field( 'Daily calories (kcal)', cals ) );
			form.appendChild( h.field( 'Share of calories from carbs', ratio ) );
			function calc() {
				var c = parseFloat( cals.value );
				if ( ! ( c > 0 ) ) { result.innerHTML = ''; return; }
				var g = c * ( parseFloat( ratio.value ) / 100 ) / 4;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Daily carbohydrate target' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: Math.round( g ) + ' g' } ),
					h.el( 'p', { 'class': 'hint', text: 'At ' + ratio.value + '% of ' + h.num( c, 0 ) + ' kcal (4 kcal per gram of carbohydrate).' } )
				] ) );
			}
			cals.addEventListener( 'input', calc ); ratio.addEventListener( 'change', calc );
		}
	} );
} )();

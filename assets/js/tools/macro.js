/** Macro Calculator — protein/carb/fat grams from calories + diet style. */
( function () {
	'use strict';
	var DIETS = {
		'Balanced (30/40/30)': [ 30, 40, 30 ],
		'High protein (40/40/20)': [ 40, 40, 20 ],
		'Low carb (40/20/40)': [ 40, 20, 40 ],
		'Keto (25/5/70)': [ 25, 5, 70 ]
	};
	GMT.register( 'macro', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var cals = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', placeholder: '2000' } );
			var diet = h.el( 'select', { 'class': 'gmt-select' } );
			Object.keys( DIETS ).forEach( function ( k ) { diet.appendChild( h.el( 'option', { value: k, text: k } ) ); } );
			form.appendChild( h.field( 'Daily calories (kcal)', cals, "Use our Calorie or TDEE calculator if you're unsure." ) );
			form.appendChild( h.field( 'Diet style (Protein / Carb / Fat)', diet ) );

			function cell( l, g, kcal, color ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { style: 'color:' + color, text: g + ' g' } ), h.el( 'span', { 'class': 'hint', text: kcal + ' kcal' } ) ] ); }
			function calc() {
				var c = parseFloat( cals.value );
				if ( ! ( c > 0 ) ) { result.innerHTML = ''; return; }
				var d = DIETS[ diet.value ];
				var pK = c * d[ 0 ] / 100, cK = c * d[ 1 ] / 100, fK = c * d[ 2 ] / 100;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your daily macros' } ),
					h.el( 'div', { 'class': 'gmt-result__grid', style: 'grid-template-columns:repeat(3,1fr)' }, [
						cell( 'Protein', Math.round( pK / 4 ), Math.round( pK ), '#1f19cd' ),
						cell( 'Carbs', Math.round( cK / 4 ), Math.round( cK ), '#712ae2' ),
						cell( 'Fat', Math.round( fK / 9 ), Math.round( fK ), '#ba1a1a' )
					] )
				] ) );
			}
			cals.addEventListener( 'input', calc );
			diet.addEventListener( 'change', calc );
		}
	} );
} )();

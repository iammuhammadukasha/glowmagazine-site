/** Protein Intake Calculator — daily grams by weight + goal. */
( function () {
	'use strict';
	var GOALS = [
		[ 'Sedentary / general health', 0.8, 1.0 ],
		[ 'Active / regular exercise', 1.2, 1.6 ],
		[ 'Build muscle', 1.6, 2.0 ],
		[ 'Lose fat (preserve muscle)', 1.8, 2.2 ]
	];
	GMT.register( 'protein', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var weight = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '70' } );
			var goal = h.el( 'select', { 'class': 'gmt-select' } );
			GOALS.forEach( function ( g, i ) { goal.appendChild( h.el( 'option', { value: String( i ), text: g[ 0 ], selected: i === 1 ? 'selected' : null } ) ); } );
			form.appendChild( h.field( 'Weight (kg)', weight ) );
			form.appendChild( h.field( 'Goal / activity', goal ) );

			function calc() {
				var w = parseFloat( weight.value );
				if ( ! ( w > 0 ) ) { result.innerHTML = ''; return; }
				var g = GOALS[ parseInt( goal.value, 10 ) ];
				var lo = Math.round( w * g[ 1 ] ), hi = Math.round( w * g[ 2 ] );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Daily protein target' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: lo + '–' + hi + ' g' } ),
					h.el( 'p', { 'class': 'hint', text: 'Based on ' + g[ 1 ] + '–' + g[ 2 ] + ' g per kg of body weight for: ' + g[ 0 ].toLowerCase() + '.' } )
				] ) );
			}
			weight.addEventListener( 'input', calc );
			goal.addEventListener( 'change', calc );
		}
	} );
} )();

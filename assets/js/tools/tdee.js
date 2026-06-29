/** TDEE Calculator — BMR × activity factor. */
( function () {
	'use strict';
	var ACT = [
		[ 'Sedentary (little or no exercise)', 1.2 ],
		[ 'Light (1–3 days/week)', 1.375 ],
		[ 'Moderate (3–5 days/week)', 1.55 ],
		[ 'Active (6–7 days/week)', 1.725 ],
		[ 'Very active (hard training / physical job)', 1.9 ]
	];
	GMT.register( 'tdee', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var sex = 'male';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var m = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Male' } );
			var f = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Female' } );
			seg.appendChild( m ); seg.appendChild( f );
			m.addEventListener( 'click', function () { sex = 'male'; m.setAttribute( 'aria-pressed', 'true' ); f.setAttribute( 'aria-pressed', 'false' ); calc(); } );
			f.addEventListener( 'click', function () { sex = 'female'; f.setAttribute( 'aria-pressed', 'true' ); m.setAttribute( 'aria-pressed', 'false' ); calc(); } );

			var age = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '30' } );
			var height = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '170' } );
			var weight = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '70' } );
			var act = h.el( 'select', { 'class': 'gmt-select' } );
			ACT.forEach( function ( a, i ) { act.appendChild( h.el( 'option', { value: String( a[ 1 ] ), text: a[ 0 ], selected: i === 2 ? 'selected' : null } ) ); } );

			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Sex' } ), seg ] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Age (years)', age ), h.field( 'Height (cm)', height ) ] ) );
			form.appendChild( h.field( 'Weight (kg)', weight ) );
			form.appendChild( h.field( 'Activity level', act ) );

			function calc() {
				var a = parseFloat( age.value ), ht = parseFloat( height.value ), wt = parseFloat( weight.value ), fac = parseFloat( act.value );
				if ( ! ( a > 0 ) || ! ( ht > 0 ) || ! ( wt > 0 ) ) { result.innerHTML = ''; return; }
				var bmr = 10 * wt + 6.25 * ht - 5 * a + ( sex === 'male' ? 5 : -161 );
				var tdee = bmr * fac;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your TDEE (maintenance calories)' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( Math.round( tdee ), 0 ) + ' kcal' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( h, 'BMR (at rest)', h.num( Math.round( bmr ), 0 ) + ' kcal' ),
						cell( h, 'Mild loss (−250)', h.num( Math.round( tdee - 250 ), 0 ) ),
						cell( h, 'Weight loss (−500)', h.num( Math.round( tdee - 500 ), 0 ) ),
						cell( h, 'Weight gain (+500)', h.num( Math.round( tdee + 500 ), 0 ) )
					] )
				] ) );
			}
			[ age, height, weight ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
			act.addEventListener( 'change', calc );
		}
	} );
	function cell( h, l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
} )();

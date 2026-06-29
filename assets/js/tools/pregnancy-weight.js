/** Pregnancy Weight Gain Calculator — IOM guidelines by pre-pregnancy BMI. */
( function () {
	'use strict';
	// [label, totalLowKg, totalHighKg, weeklyRate2nd3rd]
	var BANDS = [
		[ 'Underweight', 12.5, 18, 0.51 ],
		[ 'Normal', 11.5, 16, 0.42 ],
		[ 'Overweight', 7, 11.5, 0.28 ],
		[ 'Obese', 5, 9, 0.22 ]
	];
	GMT.register( 'pregnancy-weight', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var weight = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '60' } );
			var height = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '165' } );
			var week = h.el( 'input', { type: 'number', min: '1', max: '42', 'class': 'gmt-input', placeholder: '20' } );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Pre-pregnancy weight (kg)', weight ), h.field( 'Height (cm)', height ) ] ) );
			form.appendChild( h.field( 'Current week of pregnancy', week ) );

			function band( bmi ) { return bmi < 18.5 ? BANDS[ 0 ] : bmi < 25 ? BANDS[ 1 ] : bmi < 30 ? BANDS[ 2 ] : BANDS[ 3 ]; }
			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var w = parseFloat( weight.value ), ht = parseFloat( height.value ), wk = parseFloat( week.value );
				if ( ! ( w > 0 ) || ! ( ht > 0 ) ) { result.innerHTML = ''; return; }
				var m = ht / 100, bmi = w / ( m * m ), b = band( bmi );
				var cells = [ cell( 'Pre-pregnancy BMI', h.num( bmi, 1 ) + ' (' + b[ 0 ] + ')' ) ];
				if ( wk > 0 ) {
					var firstTri = 1; // ~0.5–2 kg, use ~1 kg
					var lo, hi;
					if ( wk <= 13 ) { lo = 0.5 * ( wk / 13 ); hi = 2 * ( wk / 13 ); }
					else { lo = 0.5 + b[ 3 ] * 0.85 * ( wk - 13 ); hi = 2 + b[ 3 ] * 1.15 * ( wk - 13 ); }
					cells.push( cell( 'Expected gain by week ' + Math.round( wk ), h.num( lo, 1 ) + '–' + h.num( hi, 1 ) + ' kg' ) );
				}
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Recommended total weight gain' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: b[ 1 ] + '–' + b[ 2 ] + ' kg' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, cells ),
					h.el( 'p', { 'class': 'hint', text: 'Based on Institute of Medicine guidelines for a single baby. Always follow your doctor’s advice.' } )
				] ) );
			}
			[ weight, height, week ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

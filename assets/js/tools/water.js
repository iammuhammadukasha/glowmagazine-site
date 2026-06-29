/** Water Intake Calculator — daily target from weight + activity. */
( function () {
	'use strict';
	GMT.register( 'water', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var weight = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '70' } );
			var exercise = h.el( 'input', { type: 'number', min: '0', 'class': 'gmt-input', value: '30' } );
			var climate = h.el( 'select', { 'class': 'gmt-select' } );
			[ [ 'Temperate', 1 ], [ 'Hot / humid', 1.15 ], [ 'Very hot', 1.3 ] ].forEach( function ( c ) { climate.appendChild( h.el( 'option', { value: String( c[ 1 ] ), text: c[ 0 ] } ) ); } );

			form.appendChild( h.field( 'Weight (kg)', weight ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Exercise (min/day)', exercise ), h.field( 'Climate', climate ) ] ) );

			function calc() {
				var w = parseFloat( weight.value ), ex = parseFloat( exercise.value ) || 0, cf = parseFloat( climate.value );
				if ( ! ( w > 0 ) ) { result.innerHTML = ''; return; }
				// 35 ml/kg baseline + ~12 ml/kg-equivalent per 30 min exercise (~0.35 L), × climate factor.
				var litres = ( w * 0.035 + ( ex / 30 ) * 0.35 ) * cf;
				var glasses = Math.round( litres * 1000 / 250 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Recommended daily water' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( litres, 1 ) + ' L' } ),
					h.el( 'p', { 'class': 'hint', text: '≈ ' + glasses + ' glasses (250 ml each). Adjust up on hot or very active days.' } )
				] ) );
			}
			[ weight, exercise ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
			climate.addEventListener( 'change', calc );
		}
	} );
} )();

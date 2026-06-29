/** BMR Calculator — Mifflin-St Jeor. */
( function () {
	'use strict';
	GMT.register( 'bmr', {
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

			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Sex' } ), seg ] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Age (years)', age ), h.field( 'Height (cm)', height ) ] ) );
			form.appendChild( h.field( 'Weight (kg)', weight ) );

			function calc() {
				var a = parseFloat( age.value ), ht = parseFloat( height.value ), wt = parseFloat( weight.value );
				if ( ! ( a > 0 ) || ! ( ht > 0 ) || ! ( wt > 0 ) ) { result.innerHTML = ''; return; }
				var bmr = 10 * wt + 6.25 * ht - 5 * a + ( sex === 'male' ? 5 : -161 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your BMR (calories/day at rest)' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( Math.round( bmr ), 0 ) + ' kcal' } ),
					h.el( 'p', { 'class': 'hint', text: 'This is the energy your body burns at complete rest. Multiply by your activity level (TDEE) for daily needs.' } )
				] ) );
			}
			[ age, height, weight ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

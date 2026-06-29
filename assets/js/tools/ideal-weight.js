/** Ideal Weight Calculator — Devine, Robinson, Miller + healthy BMI range. */
( function () {
	'use strict';
	GMT.register( 'ideal-weight', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var sex = 'male';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var m = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Male' } );
			var f = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Female' } );
			seg.appendChild( m ); seg.appendChild( f );
			m.addEventListener( 'click', function () { sex = 'male'; m.setAttribute( 'aria-pressed', 'true' ); f.setAttribute( 'aria-pressed', 'false' ); calc(); } );
			f.addEventListener( 'click', function () { sex = 'female'; f.setAttribute( 'aria-pressed', 'true' ); m.setAttribute( 'aria-pressed', 'false' ); calc(); } );

			var height = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '170' } );
			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Sex' } ), seg ] ) );
			form.appendChild( h.field( 'Height (cm)', height, 'Formulas use height over 5 ft (152.4 cm).' ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var cm = parseFloat( height.value );
				if ( ! ( cm > 0 ) ) { result.innerHTML = ''; return; }
				var inchesOver5ft = Math.max( 0, ( cm - 152.4 ) / 2.54 );
				var male = sex === 'male';
				var devine = ( male ? 50 : 45.5 ) + 2.3 * inchesOver5ft;
				var robinson = ( male ? 52 : 49 ) + ( male ? 1.9 : 1.7 ) * inchesOver5ft;
				var miller = ( male ? 56.2 : 53.1 ) + ( male ? 1.41 : 1.36 ) * inchesOver5ft;
				var mtr = cm / 100;
				var bmiLow = 18.5 * mtr * mtr, bmiHigh = 24.9 * mtr * mtr;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Healthy weight range (BMI 18.5–24.9)' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( bmiLow, 1 ) + '–' + h.num( bmiHigh, 1 ) + ' kg' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Devine formula', h.num( devine, 1 ) + ' kg' ),
						cell( 'Robinson formula', h.num( robinson, 1 ) + ' kg' ),
						cell( 'Miller formula', h.num( miller, 1 ) + ' kg' )
					] )
				] ) );
			}
			height.addEventListener( 'input', calc );
		}
	} );
} )();

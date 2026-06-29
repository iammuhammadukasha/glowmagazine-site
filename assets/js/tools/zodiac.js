/** Zodiac Sign Calculator — sign, element & traits from birth date. */
( function () {
	'use strict';
	var SIGNS = [
		[ 'Capricorn', '♑', 'Earth', 1, 19, 'Disciplined, responsible, ambitious' ],
		[ 'Aquarius', '♒', 'Air', 2, 18, 'Independent, original, humanitarian' ],
		[ 'Pisces', '♓', 'Water', 3, 20, 'Compassionate, artistic, intuitive' ],
		[ 'Aries', '♈', 'Fire', 4, 19, 'Bold, energetic, confident' ],
		[ 'Taurus', '♉', 'Earth', 5, 20, 'Reliable, patient, devoted' ],
		[ 'Gemini', '♊', 'Air', 6, 20, 'Curious, adaptable, expressive' ],
		[ 'Cancer', '♋', 'Water', 7, 22, 'Loyal, emotional, nurturing' ],
		[ 'Leo', '♌', 'Fire', 8, 22, 'Warm, generous, charismatic' ],
		[ 'Virgo', '♍', 'Earth', 9, 22, 'Practical, analytical, kind' ],
		[ 'Libra', '♎', 'Air', 10, 22, 'Diplomatic, fair, social' ],
		[ 'Scorpio', '♏', 'Water', 11, 21, 'Passionate, brave, determined' ],
		[ 'Sagittarius', '♐', 'Fire', 12, 21, 'Optimistic, adventurous, honest' ],
		[ 'Capricorn', '♑', 'Earth', 12, 31, 'Disciplined, responsible, ambitious' ]
	];
	GMT.register( 'zodiac', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var dob = h.el( 'input', { type: 'date', 'class': 'gmt-input', max: new Date().toISOString().slice( 0, 10 ) } );
			form.appendChild( h.field( 'Date of birth', dob ) );
			function calc() {
				if ( ! dob.value ) { result.innerHTML = ''; return; }
				var d = new Date( dob.value ), m = d.getMonth() + 1, day = d.getDate();
				// Each entry's [month, cutoffDay]: if day <= cutoff use that sign, else next.
				var idx = m - 1; // month-based candidate start
				var s = ( day <= SIGNS[ idx ][ 4 ] ) ? SIGNS[ idx ] : SIGNS[ idx + 1 ];
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your zodiac sign' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: s[ 1 ] + ' ' + s[ 0 ] } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: 'Element' } ), h.el( 'b', { text: s[ 2 ] } ) ] ),
						h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: 'Key traits' } ), h.el( 'b', { style: 'font-size:.95rem', text: s[ 5 ] } ) ] )
					] )
				] ) );
			}
			dob.addEventListener( 'input', calc );
		}
	} );
} )();

/** Name Numerology Calculator — Pythagorean destiny number. */
( function () {
	'use strict';
	var MEAN = {
		1: 'The Leader — independent, driven and pioneering.',
		2: 'The Peacemaker — diplomatic, sensitive and cooperative.',
		3: 'The Communicator — creative, expressive and optimistic.',
		4: 'The Builder — practical, disciplined and dependable.',
		5: 'The Free Spirit — adventurous, versatile and energetic.',
		6: 'The Nurturer — caring, responsible and harmonious.',
		7: 'The Seeker — analytical, spiritual and introspective.',
		8: 'The Powerhouse — ambitious, organised and goal-oriented.',
		9: 'The Humanitarian — compassionate, generous and idealistic.'
	};
	GMT.register( 'numerology', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var name = h.el( 'input', { type: 'text', 'class': 'gmt-input', placeholder: 'Your full name' } );
			form.appendChild( h.field( 'Full name', name ) );

			function reduce( n ) { while ( n > 9 ) { n = String( n ).split( '' ).reduce( function ( s, d ) { return s + +d; }, 0 ); } return n; }
			function calc() {
				var s = name.value.toLowerCase().replace( /[^a-z]/g, '' );
				if ( ! s ) { result.innerHTML = ''; return; }
				var sum = 0;
				for ( var i = 0; i < s.length; i++ ) { sum += ( ( s.charCodeAt( i ) - 97 ) % 9 ) + 1; }
				var num = reduce( sum );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result', style: 'text-align:center' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your destiny number' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: String( num ) } ),
					h.el( 'p', { text: MEAN[ num ] || '' } )
				] ) );
			}
			name.addEventListener( 'input', calc );
		}
	} );
} )();

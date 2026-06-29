/** Love Calculator — fun, deterministic compatibility score. */
( function () {
	'use strict';
	GMT.register( 'love', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var a = h.el( 'input', { type: 'text', 'class': 'gmt-input', placeholder: 'Your name' } );
			var b = h.el( 'input', { type: 'text', 'class': 'gmt-input', placeholder: 'Their name' } );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Name 1', a ), h.field( 'Name 2', b ) ] ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: '❤ Calculate Love', onClick: calc, style: 'margin-top:8px' } ) );

			function score( s ) {
				// Deterministic hash → 40–99%.
				var sum = 0; s = s.toLowerCase().replace( /[^a-z]/g, '' );
				for ( var i = 0; i < s.length; i++ ) { sum += s.charCodeAt( i ) * ( i + 7 ); }
				return 40 + ( sum % 60 );
			}
			function message( p ) {
				if ( p >= 90 ) { return 'A perfect match — the stars are aligned! 💞'; }
				if ( p >= 75 ) { return 'Strong connection — this one has real potential! 💕'; }
				if ( p >= 60 ) { return 'Good chemistry — nurture it and watch it grow. 💗'; }
				if ( p >= 50 ) { return 'There\'s a spark — worth exploring further. 💓'; }
				return 'Opposites attract — it\'ll take effort, but who knows! 💔';
			}
			function calc() {
				if ( ! a.value.trim() || ! b.value.trim() ) { result.innerHTML = ''; return; }
				var p = score( a.value + b.value );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result', style: 'text-align:center' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: a.value.trim() + ' ❤ ' + b.value.trim() } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: p + '%' } ),
					h.el( 'div', { 'class': 'gmt-meter' }, h.el( 'span', { 'class': 'gmt-meter__pin', style: 'left:' + p + '%' } ) ),
					h.el( 'p', { text: message( p ) } ),
					h.el( 'p', { 'class': 'hint', text: 'Just for fun — not a scientific measure of compatibility!' } )
				] ) );
			}
		}
	} );
} )();

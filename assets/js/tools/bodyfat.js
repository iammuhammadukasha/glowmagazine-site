/** Body Fat Calculator — U.S. Navy method (metric). */
( function () {
	'use strict';
	function log10( x ) { return Math.log( x ) / Math.LN10; }
	GMT.register( 'bodyfat', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var sex = 'male';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var m = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Male' } );
			var f = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Female' } );
			seg.appendChild( m ); seg.appendChild( f );

			var height = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '175' } );
			var neck = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '38' } );
			var waist = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '85' } );
			var hip = h.el( 'input', { type: 'number', min: '1', 'class': 'gmt-input', placeholder: '95' } );
			var hipField = h.field( 'Hip (cm)', hip );
			hipField.style.display = 'none';

			function setSex( s ) { sex = s; m.setAttribute( 'aria-pressed', s === 'male' ? 'true' : 'false' ); f.setAttribute( 'aria-pressed', s === 'female' ? 'true' : 'false' ); hipField.style.display = s === 'female' ? '' : 'none'; calc(); }
			m.addEventListener( 'click', function () { setSex( 'male' ); } );
			f.addEventListener( 'click', function () { setSex( 'female' ); } );

			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Sex' } ), seg ] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Height (cm)', height ), h.field( 'Neck (cm)', neck ) ] ) );
			form.appendChild( h.field( 'Waist (cm)', waist, 'At navel level.' ) );
			form.appendChild( hipField );

			function category( bf, male ) {
				var t = male ? [ 6, 14, 18, 25 ] : [ 14, 21, 25, 32 ];
				if ( bf < t[ 0 ] ) { return 'Essential fat'; }
				if ( bf < t[ 1 ] ) { return 'Athletic'; }
				if ( bf < t[ 2 ] ) { return 'Fitness'; }
				if ( bf < t[ 3 ] ) { return 'Average'; }
				return 'Above average';
			}
			function calc() {
				var ht = parseFloat( height.value ), nk = parseFloat( neck.value ), w = parseFloat( waist.value );
				if ( ! ( ht > 0 ) || ! ( nk > 0 ) || ! ( w > 0 ) ) { result.innerHTML = ''; return; }
				var bf;
				if ( sex === 'male' ) {
					if ( w - nk <= 0 ) { result.innerHTML = ''; return; }
					bf = 495 / ( 1.0324 - 0.19077 * log10( w - nk ) + 0.15456 * log10( ht ) ) - 450;
				} else {
					var hp = parseFloat( hip.value );
					if ( ! ( hp > 0 ) || w + hp - nk <= 0 ) { result.innerHTML = ''; return; }
					bf = 495 / ( 1.29579 - 0.35004 * log10( w + hp - nk ) + 0.22100 * log10( ht ) ) - 450;
				}
				if ( ! isFinite( bf ) || bf <= 0 ) { result.innerHTML = ''; return; }
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Estimated body fat' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: h.num( bf, 1 ) + '%' } ),
					h.el( 'p', {}, [ h.el( 'strong', { text: category( bf, sex === 'male' ) } ), document.createTextNode( ' — based on the U.S. Navy circumference method (an estimate).' ) ] )
				] ) );
			}
			[ height, neck, waist, hip ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

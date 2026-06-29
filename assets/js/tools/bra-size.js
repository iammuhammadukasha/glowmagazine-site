/** Bra Size Calculator — band + cup from measurements. */
( function () {
	'use strict';
	var CUPS = [ 'AA', 'A', 'B', 'C', 'D', 'DD', 'DDD/F', 'G', 'H', 'I' ];
	GMT.register( 'bra-size', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var unit = 'cm';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var bc = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'cm' } );
			var bi = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'inches' } );
			seg.appendChild( bc ); seg.appendChild( bi );
			bc.addEventListener( 'click', function () { unit = 'cm'; bc.setAttribute( 'aria-pressed', 'true' ); bi.setAttribute( 'aria-pressed', 'false' ); calc(); } );
			bi.addEventListener( 'click', function () { unit = 'in'; bi.setAttribute( 'aria-pressed', 'true' ); bc.setAttribute( 'aria-pressed', 'false' ); calc(); } );

			var under = h.el( 'input', { type: 'number', step: 'any', 'class': 'gmt-input', placeholder: '76' } );
			var bust = h.el( 'input', { type: 'number', step: 'any', 'class': 'gmt-input', placeholder: '90' } );
			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'Units' } ), seg ] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Underbust (band)', under, 'Snug, under the bust' ), h.field( 'Bust (fullest)', bust, 'Around the fullest part' ) ] ) );

			function calc() {
				var u = parseFloat( under.value ), b = parseFloat( bust.value );
				if ( ! ( u > 0 ) || ! ( b > 0 ) ) { result.innerHTML = ''; return; }
				var uin = unit === 'cm' ? u / 2.54 : u, bin = unit === 'cm' ? b / 2.54 : b;
				var band = Math.round( uin ); if ( band % 2 ) { band++; }
				var diff = Math.max( 0, Math.round( bin - band ) );
				var cup = CUPS[ Math.min( diff, CUPS.length - 1 ) ];
				var eu = Math.round( ( band * 2.54 ) / 5 ) * 5;
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result', style: 'text-align:center' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your estimated bra size' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: band + cup } ),
					h.el( 'p', { 'class': 'hint', text: 'US/UK band ' + band + ', cup ' + cup + ' · EU band ≈ ' + eu + '. Sizing varies by brand — treat this as a starting point.' } )
				] ) );
			}
			[ under, bust ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

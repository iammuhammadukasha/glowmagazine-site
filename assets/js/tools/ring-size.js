/** Ring Size Calculator — US / EU size from circumference or diameter. */
( function () {
	'use strict';
	GMT.register( 'ring-size', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var mode = 'circ';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var bC = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Circumference' } );
			var bD = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Diameter' } );
			seg.appendChild( bC ); seg.appendChild( bD );
			bC.addEventListener( 'click', function () { mode = 'circ'; bC.setAttribute( 'aria-pressed', 'true' ); bD.setAttribute( 'aria-pressed', 'false' ); field.querySelector( 'label' ).textContent = 'Finger circumference (mm)'; calc(); } );
			bD.addEventListener( 'click', function () { mode = 'dia'; bD.setAttribute( 'aria-pressed', 'true' ); bC.setAttribute( 'aria-pressed', 'false' ); field.querySelector( 'label' ).textContent = 'Inside diameter (mm)'; calc(); } );

			var val = h.el( 'input', { type: 'number', step: 'any', 'class': 'gmt-input', placeholder: '54' } );
			var field = h.field( 'Finger circumference (mm)', val, 'Wrap a strip of paper around your finger and measure in mm.' );
			form.appendChild( h.el( 'div', { 'class': 'field' }, [ h.el( 'label', { text: 'I measured' } ), seg ] ) );
			form.appendChild( field );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				var v = parseFloat( val.value );
				if ( ! ( v > 0 ) ) { result.innerHTML = ''; return; }
				var circ = mode === 'circ' ? v : v * Math.PI;
				var dia = circ / Math.PI;
				var us = ( dia - 11.63 ) / 0.8128;
				var eu = Math.round( circ );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your ring size' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: 'US ' + h.num( Math.max( 0, us ), 1 ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'EU size', String( eu ) ),
						cell( 'Circumference', h.num( circ, 1 ) + ' mm' ),
						cell( 'Inside diameter', h.num( dia, 1 ) + ' mm' )
					] )
				] ) );
			}
			val.addEventListener( 'input', calc );
		}
	} );
} )();

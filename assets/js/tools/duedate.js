/** Pregnancy Due Date Calculator — Naegele's rule. */
( function () {
	'use strict';
	GMT.register( 'duedate', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var mode = 'lmp';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var bL = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Last period' } );
			var bC = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Conception date' } );
			seg.appendChild( bL ); seg.appendChild( bC );
			var date = h.el( 'input', { type: 'date', 'class': 'gmt-input' } );
			var field = h.field( 'First day of last period', date );
			form.appendChild( h.el( 'div', { 'class': 'field' }, seg ) );
			form.appendChild( field );

			bL.addEventListener( 'click', function () { mode = 'lmp'; bL.setAttribute( 'aria-pressed', 'true' ); bC.setAttribute( 'aria-pressed', 'false' ); field.querySelector( 'label' ).textContent = 'First day of last period'; calc(); } );
			bC.addEventListener( 'click', function () { mode = 'conc'; bC.setAttribute( 'aria-pressed', 'true' ); bL.setAttribute( 'aria-pressed', 'false' ); field.querySelector( 'label' ).textContent = 'Conception date'; calc(); } );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				if ( ! date.value ) { result.innerHTML = ''; return; }
				var start = new Date( date.value );
				var due = new Date( start );
				due.setDate( due.getDate() + ( mode === 'lmp' ? 280 : 266 ) );
				var lmp = new Date( due ); lmp.setDate( lmp.getDate() - 280 );
				var days = Math.floor( ( new Date() - lmp ) / 86400000 );
				var wk = days >= 0 && days <= 300 ? Math.floor( days / 7 ) + 'w ' + ( days % 7 ) + 'd' : '—';
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Estimated due date' } ),
					h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.7rem', text: due.toLocaleDateString( undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [ cell( 'Currently', wk ), cell( 'Conception (approx)', new Date( lmp.getTime() + 14 * 86400000 ).toLocaleDateString( undefined, { month: 'short', day: 'numeric' } ) ) ] )
				] ) );
			}
			date.addEventListener( 'input', calc );
		}
	} );
} )();

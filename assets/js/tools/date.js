/** Date Calculator — difference between dates, and add/subtract. */
( function () {
	'use strict';
	GMT.register( 'date', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var mode = 'diff';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var bDiff = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'Difference' } );
			var bAdd = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'Add / Subtract' } );
			seg.appendChild( bDiff ); seg.appendChild( bAdd );
			form.appendChild( h.el( 'div', { 'class': 'field' }, seg ) );

			var today = new Date().toISOString().slice( 0, 10 );
			// Difference UI
			var d1 = h.el( 'input', { type: 'date', 'class': 'gmt-input', value: today } );
			var d2 = h.el( 'input', { type: 'date', 'class': 'gmt-input', value: today } );
			var diffWrap = h.el( 'div', {}, h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'From date', d1 ), h.field( 'To date', d2 ) ] ) );
			// Add/Subtract UI
			var base = h.el( 'input', { type: 'date', 'class': 'gmt-input', value: today } );
			var qty = h.el( 'input', { type: 'number', step: '1', 'class': 'gmt-input', value: '7' } );
			var unit = h.el( 'select', { 'class': 'gmt-select' } );
			[ 'Days', 'Weeks', 'Months', 'Years' ].forEach( function ( u ) { unit.appendChild( h.el( 'option', { value: u, text: u } ) ); } );
			var dir = h.el( 'select', { 'class': 'gmt-select' } );
			[ [ 'Add (+)', 1 ], [ 'Subtract (−)', -1 ] ].forEach( function ( o ) { dir.appendChild( h.el( 'option', { value: String( o[ 1 ] ), text: o[ 0 ] } ) ); } );
			var addWrap = h.el( 'div', { style: 'display:none' }, [ h.field( 'Start date', base ), h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Amount', qty ), h.field( 'Unit', unit ) ] ), h.field( 'Direction', dir ) ] );

			form.appendChild( diffWrap );
			form.appendChild( addWrap );

			function setMode( mm ) {
				mode = mm;
				bDiff.setAttribute( 'aria-pressed', mm === 'diff' ? 'true' : 'false' );
				bAdd.setAttribute( 'aria-pressed', mm === 'add' ? 'true' : 'false' );
				diffWrap.style.display = mm === 'diff' ? '' : 'none';
				addWrap.style.display = mm === 'add' ? '' : 'none';
				calc();
			}
			bDiff.addEventListener( 'click', function () { setMode( 'diff' ); } );
			bAdd.addEventListener( 'click', function () { setMode( 'add' ); } );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				result.innerHTML = '';
				if ( mode === 'diff' ) {
					if ( ! d1.value || ! d2.value ) { return; }
					var a = new Date( d1.value ), b = new Date( d2.value );
					var days = Math.round( Math.abs( b - a ) / 86400000 );
					result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
						h.el( 'div', { 'class': 'gmt-result__label', text: 'Difference' } ),
						h.el( 'div', { 'class': 'gmt-result__big', text: h.num( days, 0 ) + ' days' } ),
						h.el( 'div', { 'class': 'gmt-result__grid' }, [
							cell( 'Weeks', h.num( days / 7, 1 ) ),
							cell( 'Months (approx)', h.num( days / 30.44, 1 ) ),
							cell( 'Years (approx)', h.num( days / 365.25, 2 ) ),
							cell( 'Hours', h.num( days * 24, 0 ) )
						] )
					] ) );
				} else {
					if ( ! base.value || qty.value === '' ) { return; }
					var d = new Date( base.value ), q = parseInt( qty.value, 10 ) * parseInt( dir.value, 10 );
					if ( unit.value === 'Days' ) { d.setDate( d.getDate() + q ); }
					else if ( unit.value === 'Weeks' ) { d.setDate( d.getDate() + q * 7 ); }
					else if ( unit.value === 'Months' ) { d.setMonth( d.getMonth() + q ); }
					else { d.setFullYear( d.getFullYear() + q ); }
					var str = d.toLocaleDateString( undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } );
					result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
						h.el( 'div', { 'class': 'gmt-result__label', text: 'Resulting date' } ),
						h.el( 'div', { 'class': 'gmt-result__big', style: 'font-size:1.6rem', text: str } )
					] ) );
				}
			}
			[ d1, d2, base, qty, unit, dir ].forEach( function ( i ) { i.addEventListener( 'input', calc ); i.addEventListener( 'change', calc ); } );
			calc();
		}
	} );
} )();

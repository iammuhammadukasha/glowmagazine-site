/**
 * Age Calculator. Exact years/months/days + totals + next-birthday countdown.
 */
( function () {
	'use strict';

	GMT.register( 'age', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;

			function todayStr() {
				var d = new Date();
				return d.toISOString().slice( 0, 10 );
			}

			var dob = h.el( 'input', { type: 'date', 'class': 'gmt-input', max: todayStr() } );
			var at  = h.el( 'input', { type: 'date', 'class': 'gmt-input', value: todayStr() } );

			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [
				h.field( 'Date of birth', dob ),
				h.field( 'Age at date', at, 'Defaults to today.' )
			] ) );

			function diff( from, to ) {
				var y = to.getFullYear() - from.getFullYear();
				var m = to.getMonth() - from.getMonth();
				var d = to.getDate() - from.getDate();
				if ( d < 0 ) {
					m -= 1;
					// days in the month before "to".
					d += new Date( to.getFullYear(), to.getMonth(), 0 ).getDate();
				}
				if ( m < 0 ) { y -= 1; m += 12; }
				return { y: y, m: m, d: d };
			}

			function nextBirthday( birth, ref ) {
				var nb = new Date( ref.getFullYear(), birth.getMonth(), birth.getDate() );
				if ( nb < ref ) { nb.setFullYear( ref.getFullYear() + 1 ); }
				return Math.ceil( ( nb - ref ) / 86400000 );
			}

			function calc() {
				if ( ! dob.value || ! at.value ) { result.innerHTML = ''; return; }
				var from = new Date( dob.value + 'T00:00:00' );
				var to   = new Date( at.value + 'T00:00:00' );
				if ( isNaN( from ) || isNaN( to ) || to < from ) {
					result.innerHTML = '';
					result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'The "age at" date must be on or after the date of birth.' } ) );
					return;
				}

				var a = diff( from, to );
				var totalDays = Math.floor( ( to - from ) / 86400000 );
				var totalMonths = a.y * 12 + a.m;
				var nb = nextBirthday( from, to );

				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your age' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: a.y + ' yrs, ' + a.m + ' mo, ' + a.d + ' days' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Total months', h.num( totalMonths, 0 ) ),
						cell( 'Total weeks', h.num( Math.floor( totalDays / 7 ), 0 ) ),
						cell( 'Total days', h.num( totalDays, 0 ) ),
						cell( 'Total hours', h.num( totalDays * 24, 0 ) ),
						cell( 'Next birthday', nb === 0 ? '🎉 Today!' : 'in ' + h.num( nb, 0 ) + ' days' )
					] )
				] ) );
			}

			function cell( label, value ) {
				return h.el( 'div', { 'class': 'gmt-result__cell' }, [
					h.el( 'span', { 'class': 'gmt-result__label', text: label } ),
					h.el( 'b', { text: value } )
				] );
			}

			dob.addEventListener( 'input', calc );
			at.addEventListener( 'input', calc );
		}
	} );
} )();

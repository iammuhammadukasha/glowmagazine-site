/** Sleep Calculator — bedtimes / wake times based on 90-min cycles. */
( function () {
	'use strict';
	GMT.register( 'sleep', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var FALL = 15; // minutes to fall asleep

			var mode = 'wake';
			var seg = h.el( 'div', { 'class': 'gmt-segmented', role: 'group' } );
			var bWake = h.el( 'button', { type: 'button', 'aria-pressed': 'true', text: 'I want to wake up at' } );
			var bNow = h.el( 'button', { type: 'button', 'aria-pressed': 'false', text: 'If I sleep now' } );
			seg.appendChild( bWake ); seg.appendChild( bNow );

			var time = h.el( 'input', { type: 'time', 'class': 'gmt-input', value: '07:00' } );
			var timeField = h.field( 'Wake-up time', time );

			form.appendChild( h.el( 'div', { 'class': 'field' }, seg ) );
			form.appendChild( timeField );

			function setMode( m ) {
				mode = m;
				bWake.setAttribute( 'aria-pressed', m === 'wake' ? 'true' : 'false' );
				bNow.setAttribute( 'aria-pressed', m === 'now' ? 'true' : 'false' );
				timeField.style.display = ( m === 'wake' ) ? '' : 'none';
				calc();
			}
			bWake.addEventListener( 'click', function () { setMode( 'wake' ); } );
			bNow.addEventListener( 'click', function () { setMode( 'now' ); } );

			function fmt( d ) {
				var hh = d.getHours(), mm = d.getMinutes();
				var ap = hh < 12 ? 'AM' : 'PM'; var h12 = hh % 12; if ( h12 === 0 ) { h12 = 12; }
				return h12 + ':' + ( mm < 10 ? '0' : '' ) + mm + ' ' + ap;
			}

			function calc() {
				result.innerHTML = '';
				var base = new Date();
				var cards = [];
				if ( mode === 'wake' ) {
					if ( ! time.value ) { return; }
					var parts = time.value.split( ':' );
					base.setHours( +parts[ 0 ], +parts[ 1 ], 0, 0 );
					// Work backwards: 6 then 5 then 4 cycles.
					[ 6, 5, 4, 3 ].forEach( function ( c ) {
						var d = new Date( base.getTime() - ( c * 90 + FALL ) * 60000 );
						cards.push( { t: fmt( d ), s: c + ' cycles · ' + ( c * 1.5 ) + 'h' } );
					} );
					result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
						h.el( 'div', { 'class': 'gmt-result__label', text: 'Go to bed at one of these times' } ),
						grid( cards )
					] ) );
				} else {
					base.setTime( Date.now() + FALL * 60000 );
					[ 4, 5, 6 ].forEach( function ( c ) {
						var d = new Date( base.getTime() + c * 90 * 60000 );
						cards.push( { t: fmt( d ), s: c + ' cycles · ' + ( c * 1.5 ) + 'h' } );
					} );
					result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
						h.el( 'div', { 'class': 'gmt-result__label', text: 'Wake up at one of these times' } ),
						grid( cards )
					] ) );
				}
			}
			function grid( cards ) {
				return h.el( 'div', { 'class': 'gmt-result__grid' }, cards.map( function ( c ) {
					return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'b', { text: c.t } ), h.el( 'span', { 'class': 'gmt-result__label', text: c.s } ) ] );
				} ) );
			}
			time.addEventListener( 'input', calc );
			calc();
		}
	} );
} )();

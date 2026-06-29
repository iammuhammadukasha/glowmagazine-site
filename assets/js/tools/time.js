/** Time Calculator — duration between times + add/subtract H:M:S. */
( function () {
	'use strict';
	GMT.register( 'time', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;

			// Duration between two times
			var t1 = h.el( 'input', { type: 'time', step: '1', 'class': 'gmt-input', value: '09:00' } );
			var t2 = h.el( 'input', { type: 'time', step: '1', 'class': 'gmt-input', value: '17:30' } );
			form.appendChild( h.el( 'div', { 'class': 'gmt-result__label', text: 'Duration between two times', style: 'margin-bottom:8px' } ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Start', t1 ), h.field( 'End', t2 ) ] ) );

			// Add / subtract
			var hh = h.el( 'input', { type: 'number', 'class': 'gmt-input', value: '0' } );
			var mm = h.el( 'input', { type: 'number', 'class': 'gmt-input', value: '90' } );
			var ss = h.el( 'input', { type: 'number', 'class': 'gmt-input', value: '0' } );
			form.appendChild( h.el( 'div', { 'class': 'gmt-result__label', text: 'Add hours / minutes / seconds to the start time', style: 'margin:16px 0 8px' } ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Hours', hh ), h.field( 'Minutes', mm ) ] ) );
			form.appendChild( h.field( 'Seconds', ss ) );

			function secsOf( v ) { var p = v.split( ':' ).map( Number ); return ( p[ 0 ] || 0 ) * 3600 + ( p[ 1 ] || 0 ) * 60 + ( p[ 2 ] || 0 ); }
			function fmtDur( s ) { s = Math.abs( s ); var H = Math.floor( s / 3600 ), M = Math.floor( ( s % 3600 ) / 60 ), S = s % 60; return H + 'h ' + M + 'm ' + S + 's'; }
			function fmtClock( s ) { s = ( ( s % 86400 ) + 86400 ) % 86400; var H = Math.floor( s / 3600 ), M = Math.floor( ( s % 3600 ) / 60 ), S = s % 60; return ( H < 10 ? '0' : '' ) + H + ':' + ( M < 10 ? '0' : '' ) + M + ':' + ( S < 10 ? '0' : '' ) + S; }
			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				if ( ! t1.value || ! t2.value ) { result.innerHTML = ''; return; }
				var s1 = secsOf( t1.value ), s2 = secsOf( t2.value );
				var dur = s2 - s1; if ( dur < 0 ) { dur += 86400; }
				var add = ( parseInt( hh.value, 10 ) || 0 ) * 3600 + ( parseInt( mm.value, 10 ) || 0 ) * 60 + ( parseInt( ss.value, 10 ) || 0 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Duration' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: fmtDur( dur ) } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'In minutes', h.num( dur / 60, 1 ) ),
						cell( 'Start + offset', fmtClock( s1 + add ) )
					] )
				] ) );
			}
			[ t1, t2, hh, mm, ss ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
			calc();
		}
	} );
} )();

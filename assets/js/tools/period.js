/** Period Calculator — predict next periods. */
( function () {
	'use strict';
	GMT.register( 'period', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var last = h.el( 'input', { type: 'date', 'class': 'gmt-input', max: new Date().toISOString().slice( 0, 10 ) } );
			var cycle = h.el( 'input', { type: 'number', min: '20', max: '45', 'class': 'gmt-input', value: '28' } );
			var len = h.el( 'input', { type: 'number', min: '1', max: '10', 'class': 'gmt-input', value: '5' } );
			form.appendChild( h.field( 'First day of last period', last ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [ h.field( 'Cycle length (days)', cycle ), h.field( 'Period length (days)', len ) ] ) );

			function fmt( d ) { return d.toLocaleDateString( undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' } ); }
			function calc() {
				if ( ! last.value ) { result.innerHTML = ''; return; }
				var c = parseInt( cycle.value, 10 ) || 28, pl = parseInt( len.value, 10 ) || 5;
				var base = new Date( last.value );
				var rows = [];
				for ( var i = 1; i <= 3; i++ ) {
					var start = new Date( base ); start.setDate( start.getDate() + c * i );
					var end = new Date( start ); end.setDate( end.getDate() + pl - 1 );
					rows.push( h.el( 'div', { 'class': 'gmt-result__cell' }, [
						h.el( 'span', { 'class': 'gmt-result__label', text: 'Period ' + i } ),
						h.el( 'b', { style: 'font-size:.98rem', text: fmt( start ) } ),
						h.el( 'span', { 'class': 'hint', text: 'to ' + fmt( end ) } )
					] ) );
				}
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your next predicted periods' } ),
					h.el( 'div', { 'class': 'gmt-result__grid', style: 'grid-template-columns:1fr' }, rows )
				] ) );
			}
			[ last, cycle, len ].forEach( function ( i ) { i.addEventListener( 'input', calc ); } );
		}
	} );
} )();

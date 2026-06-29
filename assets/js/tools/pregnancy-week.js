/** Pregnancy Week Calculator — weeks pregnant + trimester. */
( function () {
	'use strict';
	GMT.register( 'pregnancy-week', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var lmp = h.el( 'input', { type: 'date', 'class': 'gmt-input', max: new Date().toISOString().slice( 0, 10 ) } );
			form.appendChild( h.field( 'First day of last period (LMP)', lmp ) );

			function cell( l, v ) { return h.el( 'div', { 'class': 'gmt-result__cell' }, [ h.el( 'span', { 'class': 'gmt-result__label', text: l } ), h.el( 'b', { text: v } ) ] ); }
			function calc() {
				if ( ! lmp.value ) { result.innerHTML = ''; return; }
				var start = new Date( lmp.value ), now = new Date();
				var days = Math.floor( ( now - start ) / 86400000 );
				if ( days < 0 || days > 320 ) { result.innerHTML = ''; result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Please enter a date within the last ~10 months.' } ) ); return; }
				var w = Math.floor( days / 7 ), d = days % 7;
				var tri = w < 13 ? 'First trimester' : w < 27 ? 'Second trimester' : 'Third trimester';
				var due = new Date( start ); due.setDate( due.getDate() + 280 );
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'You are' } ),
					h.el( 'div', { 'class': 'gmt-result__big', text: w + ' weeks, ' + d + ' days' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Trimester', tri ),
						cell( 'Estimated due date', due.toLocaleDateString( undefined, { month: 'short', day: 'numeric', year: 'numeric' } ) )
					] )
				] ) );
			}
			lmp.addEventListener( 'input', calc );
		}
	} );
} )();

/**
 * Word Counter. Live word/char/sentence/paragraph counts + reading time.
 */
( function () {
	'use strict';

	GMT.register( 'word-counter', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;

			var ta = h.el( 'textarea', { rows: '8', 'class': 'gmt-input', placeholder: 'Type or paste your text here…' } );
			form.appendChild( h.field( 'Your text', ta ) );

			function count() {
				var text = ta.value;
				var trimmed = text.trim();
				var words = trimmed ? ( trimmed.match( /\S+/g ) || [] ).length : 0;
				var chars = text.length;
				var charsNoSpace = text.replace( /\s/g, '' ).length;
				var sentences = trimmed ? ( trimmed.match( /[^.!?]+[.!?]+(\s|$)|\S+$/g ) || [] ).length : 0;
				var paragraphs = trimmed ? trimmed.split( /\n+/ ).filter( function ( p ) { return p.trim().length; } ).length : 0;
				var minutes = words / 225;
				var readTime = words === 0 ? '0 sec' : ( minutes < 1 ? Math.ceil( minutes * 60 ) + ' sec' : h.num( minutes, 1 ) + ' min' );

				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__grid' }, [
						cell( 'Words', h.num( words, 0 ) ),
						cell( 'Characters', h.num( chars, 0 ) ),
						cell( 'Characters (no spaces)', h.num( charsNoSpace, 0 ) ),
						cell( 'Sentences', h.num( sentences, 0 ) ),
						cell( 'Paragraphs', h.num( paragraphs, 0 ) ),
						cell( 'Reading time', readTime )
					] )
				] ) );
			}

			function cell( label, value ) {
				return h.el( 'div', { 'class': 'gmt-result__cell' }, [
					h.el( 'span', { 'class': 'gmt-result__label', text: label } ),
					h.el( 'b', { text: value } )
				] );
			}

			ta.addEventListener( 'input', count );
			count();
		}
	} );
} )();

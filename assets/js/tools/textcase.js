/** Text Case Converter — multiple cases + copy. */
( function () {
	'use strict';
	GMT.register( 'textcase', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var ta = h.el( 'textarea', { rows: '5', 'class': 'gmt-input', placeholder: 'Type or paste your text…' } );
			form.appendChild( h.field( 'Your text', ta ) );

			var modes = {
				'UPPERCASE': function ( s ) { return s.toUpperCase(); },
				'lowercase': function ( s ) { return s.toLowerCase(); },
				'Title Case': function ( s ) { return s.replace( /\w\S*/g, function ( w ) { return w.charAt( 0 ).toUpperCase() + w.slice( 1 ).toLowerCase(); } ); },
				'Sentence case': function ( s ) { return s.toLowerCase().replace( /(^\s*\w|[.!?]\s+\w)/g, function ( c ) { return c.toUpperCase(); } ); },
				'aLtErNaTiNg': function ( s ) { var o = '', u = false; for ( var i = 0; i < s.length; i++ ) { var c = s[ i ]; if ( /[a-z]/i.test( c ) ) { o += u ? c.toUpperCase() : c.toLowerCase(); u = ! u; } else { o += c; } } return o; }
			};

			var btns = h.el( 'div', { style: 'display:flex;flex-wrap:wrap;gap:8px' } );
			Object.keys( modes ).forEach( function ( label ) {
				btns.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--ghost', type: 'button', text: label, onClick: function () { apply( modes[ label ] ); } } ) );
			} );
			form.appendChild( btns );

			function apply( fn ) {
				var out = fn( ta.value );
				result.innerHTML = '';
				var field = h.el( 'textarea', { rows: '5', readonly: 'readonly', 'class': 'gmt-input' } );
				field.value = out;
				var copied = h.el( 'span', { 'class': 'gmt-copied' } );
				var copy = h.el( 'button', { 'class': 'gmt-btn gmt-btn--ghost', type: 'button', text: 'Copy', onClick: function () { h.copy( out ).then( function () { copied.textContent = '✓ Copied'; setTimeout( function () { copied.textContent = ''; }, 1500 ); } ); } } );
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [ field, h.el( 'div', { style: 'margin-top:10px;display:flex;align-items:center;gap:10px' }, [ copy, copied ] ) ] ) );
			}
		}
	} );
} )();

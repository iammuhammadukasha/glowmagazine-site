/**
 * Password Generator. Cryptographically secure, fully client-side.
 */
( function () {
	'use strict';

	GMT.register( 'password', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;

			var SETS = {
				lower: 'abcdefghijkmnopqrstuvwxyz',
				upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
				number: '23456789',
				symbol: '!@#$%^&*()-_=+[]{};:,.?'
			};

			var length = h.el( 'input', { type: 'range', min: '6', max: '40', value: '16', 'class': 'gmt-input' } );
			var lenOut = h.el( 'b', { text: '16' } );
			length.addEventListener( 'input', function () { lenOut.textContent = length.value; generate(); } );

			var opts = {};
			function checkbox( key, label, checked ) {
				var input = h.el( 'input', { type: 'checkbox' } );
				input.checked = !! checked;
				opts[ key ] = input;
				input.addEventListener( 'change', generate );
				return h.el( 'label', { 'class': 'gmt-check' }, [ input, document.createTextNode( ' ' + label ) ] );
			}

			form.appendChild( h.el( 'div', { 'class': 'gmt-field' }, [
				h.el( 'label', {}, [ document.createTextNode( 'Length: ' ), lenOut ] ),
				length
			] ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [
				checkbox( 'lower', 'Lowercase (a-z)', true ),
				checkbox( 'upper', 'Uppercase (A-Z)', true ),
				checkbox( 'number', 'Numbers (0-9)', true ),
				checkbox( 'symbol', 'Symbols (!@#$)', true )
			] ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: '↻ Generate password', onClick: generate } ) );

			function rand( max ) {
				if ( window.crypto && window.crypto.getRandomValues ) {
					var a = new Uint32Array( 1 );
					// Rejection sampling to avoid modulo bias.
					var limit = Math.floor( 0xFFFFFFFF / max ) * max;
					do { window.crypto.getRandomValues( a ); } while ( a[ 0 ] >= limit );
					return a[ 0 ] % max;
				}
				return Math.floor( Math.random() * max );
			}

			function strengthLabel( pw, poolSize ) {
				var entropy = pw.length * Math.log2( poolSize || 2 );
				if ( entropy < 40 ) { return { t: 'Weak', c: '#d23b3b' }; }
				if ( entropy < 70 ) { return { t: 'Good', c: '#f0a020' }; }
				if ( entropy < 100 ) { return { t: 'Strong', c: '#1f9d63' }; }
				return { t: 'Very strong', c: '#1f9d63' };
			}

			function generate() {
				var pool = '';
				Object.keys( SETS ).forEach( function ( k ) {
					if ( opts[ k ] && opts[ k ].checked ) { pool += SETS[ k ]; }
				} );

				result.innerHTML = '';
				if ( ! pool ) {
					result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Select at least one character type.' } ) );
					return;
				}

				var len = parseInt( length.value, 10 );
				var pw = '';
				for ( var i = 0; i < len; i++ ) { pw += pool.charAt( rand( pool.length ) ); }

				var s = strengthLabel( pw, pool.length );
				var field = h.el( 'input', { type: 'text', readonly: 'readonly', 'class': 'gmt-input', value: pw } );
				field.style.fontFamily = 'monospace'; field.style.fontSize = '18px';

				var copied = h.el( 'span', { 'class': 'gmt-copied', text: '' } );
				var copyBtn = h.el( 'button', { 'class': 'gmt-btn gmt-btn--ghost', type: 'button', text: 'Copy' } );
				copyBtn.addEventListener( 'click', function () {
					h.copy( pw ).then( function () { copied.textContent = '✓ Copied'; setTimeout( function () { copied.textContent = ''; }, 1500 ); } );
				} );

				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					field,
					h.el( 'div', { style: 'display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap' }, [
						copyBtn, copied,
						h.el( 'span', { style: 'margin-left:auto;font-weight:700;color:' + s.c, text: s.t } )
					] )
				] ) );
			}

			generate();
		}
	} );
} )();

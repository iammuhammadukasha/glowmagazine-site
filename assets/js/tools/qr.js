/**
 * QR Code Generator. Uses the GOQR image endpoint (api.qrserver.com) — no key,
 * returns a PNG that we display and offer for download.
 */
( function () {
	'use strict';

	GMT.register( 'qr', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			var ENDPOINT = 'https://api.qrserver.com/v1/create-qr-code/';

			var content = h.el( 'textarea', { rows: '3', 'class': 'gmt-input', placeholder: 'https://glowmagazine.com  or any text…' } );
			var size = h.el( 'select', { 'class': 'gmt-select' } );
			[ 150, 200, 300, 500, 800 ].forEach( function ( s ) {
				var o = h.el( 'option', { value: String( s ), text: s + ' × ' + s + ' px' } );
				if ( s === 300 ) { o.selected = true; }
				size.appendChild( o );
			} );

			form.appendChild( h.field( 'Content (link or text)', content ) );
			form.appendChild( h.el( 'div', { 'class': 'gmt-row gmt-row--2' }, [
				h.field( 'Size', size ),
				h.el( 'div', { 'class': 'gmt-field' }, h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: 'Generate QR Code', onClick: generate, style: 'margin-top:24px' } ) )
			] ) );

			function buildUrl( download ) {
				var s = size.value;
				var url = ENDPOINT + '?size=' + s + 'x' + s + '&margin=10&data=' + encodeURIComponent( content.value.trim() );
				if ( download ) { url += '&download=1'; }
				return url;
			}

			function generate() {
				var text = content.value.trim();
				result.innerHTML = '';
				if ( ! text ) {
					result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Enter a link or some text first.' } ) );
					return;
				}

				var img = h.el( 'img', {
					src: buildUrl( false ),
					alt: 'QR code for ' + text.slice( 0, 60 ),
					width: size.value,
					height: size.value,
					loading: 'lazy',
					style: 'max-width:100%;height:auto;background:#fff;padding:10px;border-radius:10px;border:1px solid var(--gmt-border)'
				} );
				img.addEventListener( 'error', function () {
					result.innerHTML = '';
					result.appendChild( h.el( 'p', { 'class': 'gmt-notice gmt-notice--error', text: 'Could not generate the QR code right now. Please try again.' } ) );
				} );

				var dl = h.el( 'a', { 'class': 'gmt-btn', href: buildUrl( true ), text: '⬇ Download PNG', download: 'qr-code.png' } );

				result.appendChild( h.el( 'div', { 'class': 'gmt-result', style: 'text-align:center' }, [
					img,
					h.el( 'div', { style: 'margin-top:12px' }, dl )
				] ) );
			}

			content.addEventListener( 'keydown', function ( e ) {
				if ( ( e.ctrlKey || e.metaKey ) && e.key === 'Enter' ) { generate(); }
			} );
		}
	} );
} )();

/** Skincare Routine Builder — AM & PM steps from skin type + concern. */
( function () {
	'use strict';
	var CLEANSER = { Oily: 'Gel/foaming cleanser', Dry: 'Cream cleanser', Combination: 'Gentle gel cleanser', Normal: 'Gentle cleanser', Sensitive: 'Fragrance-free cream cleanser' };
	var MOIST = { Oily: 'Oil-free gel moisturiser', Dry: 'Rich cream with ceramides', Combination: 'Lightweight lotion', Normal: 'Light moisturiser', Sensitive: 'Soothing barrier cream' };
	var CONCERN = {
		Acne: { am: 'Niacinamide serum', pm: 'Salicylic acid (BHA) 2–3×/week' },
		Aging: { am: 'Vitamin C serum', pm: 'Retinol (start 2×/week)' },
		Dullness: { am: 'Vitamin C serum', pm: 'AHA exfoliant 1–2×/week' },
		Redness: { am: 'Centella/soothing serum', pm: 'Azelaic acid' },
		None: { am: '', pm: '' }
	};
	GMT.register( 'skincare', {
		init: function ( ctx ) {
			var h = ctx.h, form = ctx.form, result = ctx.result;
			function sel( opts ) { var s = h.el( 'select', { 'class': 'gmt-select' } ); opts.forEach( function ( o ) { s.appendChild( h.el( 'option', { value: o, text: o } ) ); } ); return s; }
			var type = sel( [ 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive' ] );
			var concern = sel( [ 'None', 'Acne', 'Aging', 'Dullness', 'Redness' ] );
			form.appendChild( h.field( 'Skin type', type, 'Not sure? Try our Skin Type Quiz.' ) );
			form.appendChild( h.field( 'Main concern', concern ) );
			form.appendChild( h.el( 'button', { 'class': 'gmt-btn gmt-btn--block', type: 'button', text: 'Build my routine', onClick: calc, style: 'margin-top:8px' } ) );

			function list( title, steps ) {
				return h.el( 'div', { 'class': 'gmt-result__cell' }, [
					h.el( 'span', { 'class': 'gmt-result__label', text: title } ),
					h.el( 'ol', { style: 'margin:6px 0 0;padding-left:18px;line-height:1.9' }, steps.filter( Boolean ).map( function ( s ) { return h.el( 'li', { text: s } ); } ) )
				] );
			}
			function calc() {
				var t = type.value, c = CONCERN[ concern.value ];
				var am = [ CLEANSER[ t ], c.am, MOIST[ t ], 'Broad-spectrum SPF 30+' ];
				var pm = [ CLEANSER[ t ], c.pm, MOIST[ t ] ];
				result.innerHTML = '';
				result.appendChild( h.el( 'div', { 'class': 'gmt-result' }, [
					h.el( 'div', { 'class': 'gmt-result__label', text: 'Your personalised routine' } ),
					h.el( 'div', { 'class': 'gmt-result__grid' }, [ list( '☀️ Morning', am ), list( '🌙 Night', pm ) ] ),
					h.el( 'p', { 'class': 'hint', text: 'Introduce active ingredients (retinol, acids) slowly and always patch-test. SPF every morning is the single most important step.' } )
				] ) );
			}
		}
	} );
} )();

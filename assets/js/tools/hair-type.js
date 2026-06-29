/** Hair Type Quiz. */
( function () {
	'use strict';
	GMT.register( 'hair-type', {
		init: function ( ctx ) {
			GMT.quiz( ctx, {
				resultLabel: 'Your hair type',
				questions: [
					{ q: 'When your hair dries naturally, it…', a: [
						{ t: 'Stays straight', s: { Straight: 2 } }, { t: 'Forms loose S-waves', s: { Wavy: 2 } },
						{ t: 'Forms defined curls', s: { Curly: 2 } }, { t: 'Forms tight coils or zig-zags', s: { Coily: 2 } }
					] },
					{ q: 'A single strand looks…', a: [
						{ t: 'Straight with no bend', s: { Straight: 2 } }, { t: 'Slightly bent / wavy', s: { Wavy: 2 } },
						{ t: 'Spiral / loopy', s: { Curly: 2 } }, { t: 'Very tight spiral', s: { Coily: 2 } }
					] },
					{ q: 'Without product, frizz is…', a: [
						{ t: 'Rare', s: { Straight: 2 } }, { t: 'Some on humid days', s: { Wavy: 1, Curly: 1 } },
						{ t: 'Common', s: { Curly: 2 } }, { t: 'Very common', s: { Coily: 2 } }
					] },
					{ q: 'Your hair holds a curl…', a: [
						{ t: 'Barely at all', s: { Straight: 2 } }, { t: 'For a little while', s: { Wavy: 2 } },
						{ t: 'Easily', s: { Curly: 2 } }, { t: 'Naturally, always', s: { Coily: 2 } }
					] }
				],
				results: {
					Straight: { title: '💧 Type 1 — Straight', text: 'Hair falls straight without natural curl.', tips: 'Tends to get oily faster — use lightweight products and wash as needed. Volumising formulas help.' },
					Wavy: { title: '🌊 Type 2 — Wavy', text: 'Loose S-shaped waves with some body.', tips: 'Use lightweight, anti-frizz products and scrunch while damp. Avoid heavy oils that flatten waves.' },
					Curly: { title: '🌀 Type 3 — Curly', text: 'Defined spiral curls with plenty of volume.', tips: 'Hydration is key — use sulphate-free cleansers, leave-in conditioner, and the “plopping” technique.' },
					Coily: { title: '🔆 Type 4 — Coily', text: 'Tight coils or zig-zag pattern, often very voluminous.', tips: 'Prioritise deep moisture: creamy leave-ins, butters and protective styles. Detangle gently when wet.' }
				}
			} );
		}
	} );
} )();

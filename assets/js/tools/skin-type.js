/** Skin Type Quiz. */
( function () {
	'use strict';
	GMT.register( 'skin-type', {
		init: function ( ctx ) {
			GMT.quiz( ctx, {
				resultLabel: 'Your skin type',
				questions: [
					{ q: 'A few hours after washing, your skin feels…', a: [
						{ t: 'Tight or dry', s: { Dry: 2 } }, { t: 'Shiny all over', s: { Oily: 2 } },
						{ t: 'Shiny T-zone, normal cheeks', s: { Combination: 2 } }, { t: 'Comfortable', s: { Normal: 2 } }
					] },
					{ q: 'How visible are your pores?', a: [
						{ t: 'Barely visible', s: { Dry: 1, Normal: 1 } }, { t: 'Large, especially the nose', s: { Oily: 2 } },
						{ t: 'Visible on the T-zone only', s: { Combination: 2 } }, { t: 'Normal sized', s: { Normal: 2 } }
					] },
					{ q: 'By midday, your face is usually…', a: [
						{ t: 'Flaky or dry', s: { Dry: 2 } }, { t: 'Greasy', s: { Oily: 2 } },
						{ t: 'Oily T-zone, dry cheeks', s: { Combination: 2 } }, { t: 'About the same as the morning', s: { Normal: 2 } }
					] },
					{ q: 'New skincare products often…', a: [
						{ t: 'Sting or cause redness', s: { Sensitive: 3 } }, { t: 'Leave me greasy', s: { Oily: 1 } },
						{ t: 'Aren’t moisturising enough', s: { Dry: 1 } }, { t: 'Work fine', s: { Normal: 1 } }
					] },
					{ q: 'Your cheeks tend to be…', a: [
						{ t: 'Dry and tight', s: { Dry: 2 } }, { t: 'Oily', s: { Oily: 2 } },
						{ t: 'Reactive or red', s: { Sensitive: 2 } }, { t: 'Balanced', s: { Normal: 1, Combination: 1 } }
					] }
				],
				results: {
					Oily: { title: '✨ Oily Skin', text: 'Your skin produces excess sebum, giving shine and larger pores.', tips: 'Use a gentle foaming cleanser, lightweight gel moisturiser, and a non-comedogenic SPF. Don’t over-strip — it can increase oil.' },
					Dry: { title: '🌵 Dry Skin', text: 'Your skin lacks oil and can feel tight or flaky.', tips: 'Use a creamy cleanser, a rich moisturiser with ceramides/hyaluronic acid, and avoid hot water.' },
					Combination: { title: '🌓 Combination Skin', text: 'Oily T-zone with normal-to-dry cheeks.', tips: 'Use a balanced cleanser and consider lighter products on the T-zone, richer ones on the cheeks.' },
					Normal: { title: '🌿 Normal Skin', text: 'Well balanced — not too oily or dry.', tips: 'Keep it simple: gentle cleanser, light moisturiser, daily SPF.' },
					Sensitive: { title: '🌸 Sensitive Skin', text: 'Your skin reacts easily to products or environment.', tips: 'Choose fragrance-free, minimal-ingredient products and always patch-test. Look for soothing ingredients like centella and oat.' }
				}
			} );
		}
	} );
} )();

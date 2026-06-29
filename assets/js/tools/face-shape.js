/** Face Shape Detector — guided questionnaire (no photo needed). */
( function () {
	'use strict';
	GMT.register( 'face-shape', {
		init: function ( ctx ) {
			ctx.form.appendChild( ctx.h.el( 'p', { 'class': 'hint', style: 'margin-bottom:14px', text: 'Answer a few questions about your proportions. (Tip: pull hair back and look in a mirror, or measure with a tape.)' } ) );
			GMT.quiz( ctx, {
				resultLabel: 'Your face shape',
				cta: 'Reveal my face shape',
				questions: [
					{ q: 'Compared with its width, your face length is…', a: [
						{ t: 'About the same (as wide as long)', s: { Round: 2, Square: 1 } },
						{ t: 'Noticeably longer than wide', s: { Oblong: 2, Oval: 1 } },
						{ t: 'A little longer than wide', s: { Oval: 2, Heart: 1 } }
					] },
					{ q: 'The widest part of your face is your…', a: [
						{ t: 'Cheekbones', s: { Diamond: 2, Oval: 1 } },
						{ t: 'Forehead', s: { Heart: 2 } },
						{ t: 'Jawline', s: { Square: 2 } },
						{ t: 'All about equal', s: { Round: 2, Oblong: 1 } }
					] },
					{ q: 'Your jawline is…', a: [
						{ t: 'Soft and rounded', s: { Round: 2 } },
						{ t: 'Strong and angular', s: { Square: 2 } },
						{ t: 'Narrow / pointed chin', s: { Heart: 2, Diamond: 1 } },
						{ t: 'Gently tapered', s: { Oval: 2 } }
					] },
					{ q: 'Your forehead is…', a: [
						{ t: 'Wide', s: { Heart: 2, Square: 1 } },
						{ t: 'Narrow', s: { Diamond: 2 } },
						{ t: 'Medium / balanced', s: { Oval: 2, Round: 1 } }
					] }
				],
				results: {
					Oval: { title: '🥚 Oval', text: 'Balanced proportions with a gently rounded jaw — the most versatile shape.', tips: 'Most hairstyles and glasses suit you. Avoid covering your face with heavy fringes.' },
					Round: { title: '⚪ Round', text: 'Soft angles with width and length roughly equal.', tips: 'Add height and angular frames; layered cuts and side parts elongate the face.' },
					Square: { title: '⬛ Square', text: 'Strong, angular jaw with a broad forehead.', tips: 'Soften with layers and round/oval glasses; textured styles work well.' },
					Heart: { title: '💗 Heart', text: 'Wider forehead and cheekbones tapering to a narrow chin.', tips: 'Chin-length cuts and bottom-heavy frames balance the jaw. Side-swept fringes flatter.' },
					Oblong: { title: '📏 Oblong', text: 'Longer than it is wide, with a straight cheek line.', tips: 'Add width with waves and fringes; avoid very long, straight styles.' },
					Diamond: { title: '💎 Diamond', text: 'Narrow forehead and jaw with wide cheekbones.', tips: 'Styles with volume at the forehead and jaw, and frames wider than the cheekbones, balance the face.' }
				}
			} );
		}
	} );
} )();

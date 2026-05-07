import { css } from 'glamor';
import { colors, fonts } from './tokens';

// Use glamor.css.insert (already in deps) to install global resets and base typography.
// Done once at module import — Layout imports this file at the top so it runs before paint.
css.insert(`
	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	body {
		background: ${colors.paper};
		color: ${colors.ink};
		font-family: ${fonts.body};
		font-size: 15px;
		line-height: 1.5;
		font-feature-settings: "ss01", "kern";
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}
	h1, h2, h3, h4 { margin: 0; font-family: ${fonts.display}; font-weight: 500; letter-spacing: -0.01em; color: ${colors.ink}; }
	p { margin: 0; }
	button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
	input, select, textarea { font: inherit; color: inherit; }
	a { color: ${colors.accent}; text-decoration: none; }
	a:hover { text-decoration: underline; }
	::selection { background: ${colors.highlight}; color: ${colors.ink}; }

	/* react-modal overrides — used only for the error dialog now. */
	.ReactModal__Overlay {
		background: ${colors.overlay} !important;
		opacity: 0;
		transition: opacity 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}
	.ReactModal__Overlay--after-open { opacity: 1; }
	.ReactModal__Overlay--before-close { opacity: 0; }
	.ReactModal__Content {
		background: ${colors.surface} !important;
		border: 1px solid ${colors.border} !important;
		border-radius: 12px !important;
		padding: 24px !important;
		box-shadow: 0 24px 48px rgba(40, 30, 15, 0.16) !important;
	}
`);

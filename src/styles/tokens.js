// Single source of truth for color, spacing, type, motion.
// Palette is intentionally warm/archival (paper + ink + terracotta) to match a music-catalog
// theme and to avoid the generic purple-on-white SaaS aesthetic.

export const colors = {
	ink: '#1a1611',
	inkSoft: '#3d342a',
	inkMuted: '#75695a',
	inkSubtle: '#a89c8a',
	paper: '#f6f1e6',
	paperDeep: '#ece4d2',
	surface: '#ffffff',
	surfaceAlt: '#fbf6ec',
	border: '#d9ceb7',
	borderSoft: '#ece2cd',
	borderStrong: '#bfb39a',
	accent: '#0e166e',
	accentHover: '#0a1059',
	accentSoft: '#e2e4f6',
	accentInk: '#ffffff',
	danger: '#9c2c2c',
	dangerHover: '#7a1f1f',
	dangerSoft: '#f3dcdc',
	success: '#3d6b3a',
	highlight: '#fff3d6',
	rowSelected: '#fbeacb',
	overlay: 'rgba(26, 22, 17, 0.42)'
};

// 4px base scale — keep all paddings/margins on this grid.
export const space = {
	'0': 0, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '7': 32, '8': 40, '9': 56, '10': 72
};

export const radius = { sm: 4, md: 6, lg: 10, xl: 16, pill: 999 };

export const fonts = {
	display: '"Fraunces", "Times New Roman", Georgia, serif',
	body: '"Newsreader", "Iowan Old Style", Charter, Georgia, serif',
	mono: 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace'
};

export const type = {
	display1: { fontFamily: fonts.display, fontWeight: 600, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' },
	display2: { fontFamily: fonts.display, fontWeight: 500, fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.01em' },
	heading: { fontFamily: fonts.display, fontWeight: 500, fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.005em' },
	body: { fontFamily: fonts.body, fontWeight: 400, fontSize: 15, lineHeight: 1.5 },
	bodySm: { fontFamily: fonts.body, fontWeight: 400, fontSize: 13, lineHeight: 1.45 },
	label: { fontFamily: fonts.body, fontWeight: 500, fontSize: 13, lineHeight: 1.3 },
	overline: { fontFamily: fonts.body, fontWeight: 600, fontSize: 11, lineHeight: 1.2, letterSpacing: '0.12em', textTransform: 'uppercase' },
	mono: { fontFamily: fonts.mono, fontWeight: 400, fontSize: 13 }
};

export const shadow = {
	sm: '0 1px 2px rgba(40, 30, 15, 0.06)',
	md: '0 6px 18px rgba(40, 30, 15, 0.08), 0 2px 4px rgba(40, 30, 15, 0.04)',
	lg: '0 24px 48px rgba(40, 30, 15, 0.16), 0 6px 16px rgba(40, 30, 15, 0.08)',
	focus: `0 0 0 3px rgba(14, 22, 110, 0.22)`
};

export const motion = {
	fast: '120ms cubic-bezier(0.22, 0.61, 0.36, 1)',
	med: '220ms cubic-bezier(0.22, 0.61, 0.36, 1)',
	slow: '360ms cubic-bezier(0.22, 0.61, 0.36, 1)'
};

export const breakpoints = {
	phone: '@media (max-width: 640px)',
	tablet: '@media (max-width: 960px)'
};

export const z = {
	header: 10,
	dropdown: 100,
	overlay: 1000,
	drawer: 1010,
	popover: 1020
};

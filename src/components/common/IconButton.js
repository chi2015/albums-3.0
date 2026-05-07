import React, { forwardRef } from "react";
import glamorous from "glamorous";
import { colors, motion, radius, shadow } from "../../styles/tokens";

const Base = glamorous.button(
	{
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 32,
		height: 32,
		borderRadius: radius.md,
		color: colors.inkSoft,
		background: 'transparent',
		border: `1px solid transparent`,
		cursor: 'pointer',
		transition: `background ${motion.fast}, color ${motion.fast}, border-color ${motion.fast}`,
		':hover:not(:disabled)': { background: colors.surfaceAlt, color: colors.ink, borderColor: colors.borderSoft },
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus },
		':disabled': { opacity: 0.4, cursor: 'not-allowed' }
	},
	({ tone }) => tone === 'danger' ? {
		color: colors.danger,
		':hover:not(:disabled)': { background: colors.dangerSoft, color: colors.dangerHover, borderColor: colors.dangerSoft }
	} : null
);

// glamorous 4.x forwards DOM refs via `innerRef`, not `ref`. We expose a normal ref API
// here and translate to innerRef for the underlying styled element.
const IconButton = forwardRef(function IconButton({ icon, label, ...rest }, ref) {
	return <Base innerRef={ref} aria-label={label} title={label} type="button" {...rest}>{icon}</Base>;
});

export default IconButton;

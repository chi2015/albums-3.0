import React from "react";
import glamorous from "glamorous";
import { colors, radius, motion, shadow, type } from "../../styles/tokens";

// Variant-driven button. `kind` controls visual hierarchy (primary/secondary/ghost/danger),
// `size` controls density. Disabled and loading states are mutually exclusive.

const variantStyles = {
	primary: {
		background: colors.accent,
		color: colors.accentInk,
		border: `1px solid ${colors.accent}`,
		':hover:not(:disabled)': { background: colors.accentHover, borderColor: colors.accentHover },
		':active:not(:disabled)': { transform: 'translateY(1px)' }
	},
	secondary: {
		background: colors.surface,
		color: colors.ink,
		border: `1px solid ${colors.border}`,
		':hover:not(:disabled)': { background: colors.surfaceAlt, borderColor: colors.borderStrong },
	},
	ghost: {
		background: 'transparent',
		color: colors.inkSoft,
		border: `1px solid transparent`,
		':hover:not(:disabled)': { background: colors.surfaceAlt, color: colors.ink },
	},
	danger: {
		background: colors.surface,
		color: colors.danger,
		border: `1px solid ${colors.dangerSoft}`,
		':hover:not(:disabled)': { background: colors.dangerSoft, borderColor: colors.danger, color: colors.dangerHover }
	},
	dangerSolid: {
		background: colors.danger,
		color: '#fff',
		border: `1px solid ${colors.danger}`,
		':hover:not(:disabled)': { background: colors.dangerHover, borderColor: colors.dangerHover }
	}
};

const sizeStyles = {
	sm: { padding: '4px 10px', fontSize: 12.5, height: 28, borderRadius: radius.md },
	md: { padding: '8px 14px', fontSize: 14, height: 36, borderRadius: radius.md },
	lg: { padding: '10px 18px', fontSize: 15, height: 42, borderRadius: radius.md }
};

const Base = glamorous.button(
	{
		fontFamily: type.body.fontFamily,
		fontWeight: 500,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		transition: `background ${motion.fast}, color ${motion.fast}, border-color ${motion.fast}, box-shadow ${motion.fast}, transform ${motion.fast}`,
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus },
		':disabled': { opacity: 0.5, cursor: 'not-allowed' }
	},
	({ kind = 'secondary', size = 'md', block }) => ({
		...variantStyles[kind],
		...sizeStyles[size],
		width: block ? '100%' : undefined
	})
);

const Button = ({ children, leadingIcon, trailingIcon, ...rest }) => (
	<Base {...rest}>
		{leadingIcon}
		{children}
		{trailingIcon}
	</Base>
);

export default Button;

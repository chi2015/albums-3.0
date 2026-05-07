import React, { forwardRef } from "react";
import glamorous from "glamorous";
import { colors, motion, radius, shadow, type } from "../../styles/tokens";

const Wrap = glamorous.label({
	display: 'flex',
	flexDirection: 'column',
	gap: 4,
	width: '100%'
});

const LabelText = glamorous.span({
	...type.label,
	color: colors.inkSoft
});

const InputBase = glamorous.input(
	{
		...type.body,
		appearance: 'none',
		background: colors.surface,
		color: colors.ink,
		border: `1px solid ${colors.border}`,
		borderRadius: radius.md,
		padding: '9px 12px',
		height: 38,
		transition: `border-color ${motion.fast}, box-shadow ${motion.fast}, background ${motion.fast}`,
		':hover:not(:disabled):not(:focus)': { borderColor: colors.borderStrong },
		':focus': { outline: 'none', borderColor: colors.accent, boxShadow: shadow.focus },
		'::placeholder': { color: colors.inkSubtle }
	},
	({ invalid }) => invalid ? {
		borderColor: colors.danger,
		':focus': { outline: 'none', borderColor: colors.danger, boxShadow: `0 0 0 3px ${colors.dangerSoft}` }
	} : null
);

const HelpText = glamorous.span({
	...type.bodySm,
	color: colors.inkMuted
});

const ErrorText = glamorous.span({
	...type.bodySm,
	color: colors.danger
});

const TextField = forwardRef(function TextField(
	{ label, hint, error, type: inputType = 'text', id, ...rest },
	ref
) {
	const fieldId = id || `f_${rest.name || Math.random().toString(36).slice(2, 8)}`;
	return (
		<Wrap htmlFor={fieldId}>
			{label && <LabelText>{label}</LabelText>}
			<InputBase id={fieldId} type={inputType} invalid={!!error} aria-invalid={!!error} innerRef={ref} {...rest} />
			{error ? <ErrorText>{error}</ErrorText> : (hint ? <HelpText>{hint}</HelpText> : null)}
		</Wrap>
	);
});

export default TextField;

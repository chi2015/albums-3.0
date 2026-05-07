import React, { useState, useEffect, useRef, useCallback } from "react";
import glamorous from "glamorous";
import { colors, motion, radius, shadow, type, z } from "../../styles/tokens";
import { MONTHS, monthShort, pad2 } from "../../utils/months";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "../common/Icon";
import IconButton from "../common/IconButton";

// ----- Styled primitives -----------------------------------------------------

const Anchor = glamorous.div({ position: 'relative', display: 'inline-block' });

const Trigger = glamorous.button(
	{
		...type.body,
		display: 'inline-flex',
		alignItems: 'center',
		gap: 8,
		height: 38,
		padding: '0 12px',
		background: colors.surface,
		color: colors.ink,
		border: `1px solid ${colors.border}`,
		borderRadius: radius.md,
		cursor: 'pointer',
		transition: `background ${motion.fast}, border-color ${motion.fast}, box-shadow ${motion.fast}`,
		':hover:not(:disabled)': { background: colors.surfaceAlt, borderColor: colors.borderStrong },
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus }
	},
	({ open }) => open ? { borderColor: colors.accent, boxShadow: shadow.focus } : null
);

const TriggerText = glamorous.span({ flex: '0 1 auto', textAlign: 'left' });

const Popover = glamorous.div({
	position: 'absolute',
	top: 'calc(100% + 6px)',
	left: 0,
	zIndex: z.popover,
	width: 320,
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.lg,
	boxShadow: shadow.lg,
	padding: 14,
	display: 'flex',
	flexDirection: 'column',
	gap: 10,
	transformOrigin: 'top left',
	animation: `dpEnter 180ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
	'@keyframes dpEnter': {
		from: { opacity: 0, transform: 'translateY(-4px) scale(0.98)' },
		to: { opacity: 1, transform: 'translateY(0) scale(1)' }
	}
});

const YearRow = glamorous.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '0 4px'
});

const YearLabel = glamorous.div({
	...type.heading,
	fontSize: 17,
	letterSpacing: '-0.01em'
});

const YearLabelMuted = glamorous.span({
	color: colors.inkMuted,
	fontStyle: 'italic',
	fontWeight: 400,
	fontSize: 14
});

const MonthGrid = glamorous.div({
	display: 'grid',
	gridTemplateColumns: 'repeat(4, 1fr)',
	gap: 6
});

const MonthBtn = glamorous.button(
	{
		...type.bodySm,
		padding: '8px 0',
		borderRadius: radius.md,
		border: `1px solid transparent`,
		background: 'transparent',
		color: colors.inkSoft,
		cursor: 'pointer',
		transition: `background ${motion.fast}, color ${motion.fast}, border-color ${motion.fast}`,
		':hover': { background: colors.surfaceAlt, color: colors.ink },
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus }
	},
	({ selected, dimmed }) => {
		if (selected) {
			return {
				background: colors.accent,
				color: colors.accentInk,
				borderColor: colors.accent,
				fontWeight: 600,
				':hover': { background: colors.accentHover, color: colors.accentInk }
			};
		}
		if (dimmed) return { color: colors.inkSubtle };
		return null;
	}
);

const ToggleRow = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	gap: 6,
	paddingTop: 4,
	borderTop: `1px solid ${colors.borderSoft}`
});

const ToggleBtn = glamorous.button(
	{
		...type.bodySm,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
		padding: '8px 10px',
		borderRadius: radius.md,
		border: `1px solid ${colors.borderSoft}`,
		background: colors.surface,
		color: colors.inkSoft,
		cursor: 'pointer',
		transition: `background ${motion.fast}, border-color ${motion.fast}, color ${motion.fast}`,
		':hover': { background: colors.surfaceAlt, color: colors.ink, borderColor: colors.border },
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus }
	},
	({ active }) => active ? {
		background: colors.accentSoft,
		borderColor: colors.accent,
		color: colors.accentHover,
		fontWeight: 600
	} : null
);

const ToggleHint = glamorous.span({
	...type.bodySm,
	color: colors.inkMuted,
	fontSize: 11,
	textTransform: 'uppercase',
	letterSpacing: '0.08em'
});

const DaySection = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	gap: 6,
	paddingTop: 8,
	borderTop: `1px solid ${colors.borderSoft}`
});

const DayHead = glamorous.div({
	display: 'grid',
	gridTemplateColumns: 'repeat(7, 1fr)',
	gap: 2
});

const DayHeadCell = glamorous.div({
	...type.overline,
	fontSize: 10,
	textAlign: 'center',
	color: colors.inkMuted,
	padding: '4px 0'
});

const DayGrid = glamorous.div({
	display: 'grid',
	gridTemplateColumns: 'repeat(7, 1fr)',
	gap: 2
});

const DayBtn = glamorous.button(
	{
		...type.bodySm,
		fontSize: 12,
		padding: '6px 0',
		borderRadius: radius.sm,
		border: `1px solid transparent`,
		background: 'transparent',
		color: colors.inkSoft,
		cursor: 'pointer',
		transition: `background ${motion.fast}, color ${motion.fast}`,
		':hover:not(:disabled)': { background: colors.surfaceAlt, color: colors.ink },
		':disabled': { color: 'transparent', cursor: 'default' },
		':focus': { outline: 'none' },
		':focus-visible': { boxShadow: shadow.focus }
	},
	({ selected, today }) => {
		if (selected) return { background: colors.accent, color: colors.accentInk, fontWeight: 600 };
		if (today) return { borderColor: colors.border, color: colors.ink };
		return null;
	}
);

// ----- Helpers ---------------------------------------------------------------

// Render a human-readable label for the trigger button based on the current value.
function describe(value) {
	const y = parseInt(value.year, 10) || 0;
	const m = parseInt(value.month, 10) || 0;
	const d = value.day != null ? parseInt(value.day, 10) || 0 : 0;
	if (!y && !m) return 'Any time';
	if (y && !m) return `${y} (all months)`;
	if (!y && m) return `${monthShort(m)} (all years)`;
	if (y && m && d) return `${monthShort(m)} ${d}, ${y}`;
	return `${monthShort(m)} ${y}`;
}

function daysInMonth(y, m) {
	if (!y || !m) return 31;
	return new Date(y, m, 0).getDate();
}

// JS getDay() returns Sun=0..Sat=6. We render Mon-first weeks, so shift.
function firstWeekdayMonFirst(y, m) {
	if (!y || !m) return 0;
	const sundayFirst = new Date(y, m - 1, 1).getDay();
	return (sundayFirst + 6) % 7;
}

const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ----- Component -------------------------------------------------------------

const DatePicker = ({
	value = { year: 0, month: 0, day: null },
	onChange,
	allowAllMonths = true,
	allowAllYears = true,
	allowAllTime = true,
	allowDay = false,
	minYear = 1970,
	maxYear,
	disabled = false,
	placeholder = 'Pick a date',
	triggerLabel
}) => {
	const [open, setOpen] = useState(false);
	const popoverRef = useRef(null);
	const triggerRef = useRef(null);
	const today = new Date();
	const effectiveMaxYear = maxYear || today.getFullYear() + 1;

	const initialViewYear = parseInt(value.year, 10) || today.getFullYear();
	const [viewYear, setViewYear] = useState(initialViewYear);
	const [showDay, setShowDay] = useState(allowDay && value.day != null);

	useEffect(() => {
		if (open) setViewYear(parseInt(value.year, 10) || today.getFullYear());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// Close on outside click and Esc; both standard popover affordances.
	useEffect(() => {
		if (!open) return;
		const onDocDown = (e) => {
			if (popoverRef.current && popoverRef.current.contains(e.target)) return;
			if (triggerRef.current && triggerRef.current.contains(e.target)) return;
			setOpen(false);
		};
		const onKey = (e) => {
			if (e.key === 'Escape') { setOpen(false); triggerRef.current && triggerRef.current.focus(); }
		};
		document.addEventListener('mousedown', onDocDown);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onDocDown);
			document.removeEventListener('keydown', onKey);
		};
	}, [open]);

	const emit = useCallback((next) => {
		onChange && onChange(next);
	}, [onChange]);

	const selectedYear = parseInt(value.year, 10) || 0;
	const selectedMonth = parseInt(value.month, 10) || 0;
	const selectedDay = value.day != null ? (parseInt(value.day, 10) || 0) : 0;

	const pickMonth = (m) => {
		// Always commits a month+year selection when clicking a month tile. If "all years"
		// mode was active, this collapses back to a specific year/month combo.
		emit({ year: viewYear, month: m, day: showDay ? selectedDay || null : null });
	};

	const pickAllMonthsForYear = () => {
		emit({ year: viewYear, month: 0, day: null });
		setShowDay(false);
	};

	const pickAllYearsForMonth = (m) => {
		emit({ year: 0, month: m, day: null });
		setShowDay(false);
	};

	const pickAnyTime = () => {
		emit({ year: 0, month: 0, day: null });
		setShowDay(false);
	};

	const pickDay = (d) => {
		emit({ year: viewYear, month: selectedMonth || (today.getMonth() + 1), day: d });
	};

	const stepYear = (delta) => {
		const next = Math.max(minYear, Math.min(effectiveMaxYear, viewYear + delta));
		setViewYear(next);
	};

	// Whether the year stepper currently reflects the *selected* year for highlighting.
	const stepperOnSelectedYear = selectedYear && selectedYear === viewYear;

	// Day grid rows: pad before first weekday, then days. Weeks are Mon..Sun.
	let dayCells = [];
	if (showDay) {
		const dim = daysInMonth(viewYear, selectedMonth || 1);
		const pad = firstWeekdayMonFirst(viewYear, selectedMonth || 1);
		for (let i = 0; i < pad; i++) dayCells.push(null);
		for (let d = 1; d <= dim; d++) dayCells.push(d);
	}

	return (
		<Anchor>
			<Trigger
				innerRef={triggerRef}
				onClick={() => !disabled && setOpen(o => !o)}
				disabled={disabled}
				open={open}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={open}
			>
				<CalendarIcon size={16} />
				<TriggerText>{triggerLabel || (value.year || value.month ? describe(value) : placeholder)}</TriggerText>
			</Trigger>
			{open && (
				<Popover innerRef={popoverRef} role="dialog" aria-label="Choose date">
					<YearRow>
						<IconButton
							icon={<ChevronLeftIcon size={16} />}
							label="Previous year"
							onClick={() => stepYear(-1)}
							disabled={viewYear <= minYear}
						/>
						<YearLabel>
							{viewYear}
							{!stepperOnSelectedYear && selectedYear === 0 && selectedMonth > 0 && (
								<YearLabelMuted>  any year</YearLabelMuted>
							)}
						</YearLabel>
						<IconButton
							icon={<ChevronRightIcon size={16} />}
							label="Next year"
							onClick={() => stepYear(1)}
							disabled={viewYear >= effectiveMaxYear}
						/>
					</YearRow>

					<MonthGrid>
						{MONTHS.map(({ num, short }) => {
							// A tile is "selected" if year+month exactly match, or if month-only
							// mode is active (year=0) and this is the chosen month.
							const monthOnlyMatch = selectedYear === 0 && selectedMonth === num;
							const exactMatch = stepperOnSelectedYear && selectedMonth === num;
							const selected = exactMatch || monthOnlyMatch;
							return (
								<MonthBtn
									key={num}
									type="button"
									selected={selected}
									dimmed={selectedYear === 0 && selectedMonth > 0 && selectedMonth !== num}
									onClick={() => pickMonth(num)}
								>
									{short}
								</MonthBtn>
							);
						})}
					</MonthGrid>

					{(allowAllMonths || allowAllYears || allowAllTime) && (
						<ToggleRow>
							{allowAllMonths && (
								<ToggleBtn
									type="button"
									active={selectedYear === viewYear && selectedMonth === 0}
									onClick={pickAllMonthsForYear}
								>
									<span>All months in {viewYear}</span>
									<ToggleHint>year only</ToggleHint>
								</ToggleBtn>
							)}
							{allowAllYears && selectedMonth > 0 && (
								<ToggleBtn
									type="button"
									active={selectedYear === 0 && selectedMonth > 0}
									onClick={() => pickAllYearsForMonth(selectedMonth)}
								>
									<span>Any year, {monthShort(selectedMonth)}</span>
									<ToggleHint>month only</ToggleHint>
								</ToggleBtn>
							)}
							{allowAllTime && (
								<ToggleBtn
									type="button"
									active={!selectedYear && !selectedMonth}
									onClick={pickAnyTime}
								>
									<span>Any / unspecified</span>
									<ToggleHint>all time</ToggleHint>
								</ToggleBtn>
							)}
						</ToggleRow>
					)}

					{allowDay && (
						<DaySection>
							{!showDay ? (
								<ToggleBtn
									type="button"
									onClick={() => setShowDay(true)}
									disabled={!selectedMonth || !selectedYear}
								>
									<span>{selectedMonth && selectedYear ? 'Pick a specific day' : 'Pick a year and month first'}</span>
									<ToggleHint>day</ToggleHint>
								</ToggleBtn>
							) : (
								<>
									<DayHead>{WEEKDAYS.map(w => <DayHeadCell key={w}>{w.charAt(0)}</DayHeadCell>)}</DayHead>
									<DayGrid>
										{dayCells.map((d, i) => d == null
											? <DayBtn key={`p${i}`} disabled type="button" />
											: <DayBtn
												key={d}
												type="button"
												onClick={() => pickDay(d)}
												selected={selectedDay === d && stepperOnSelectedYear && selectedMonth > 0}
												today={today.getFullYear() === viewYear && (today.getMonth() + 1) === selectedMonth && today.getDate() === d}
											>{d}</DayBtn>)}
									</DayGrid>
									<ToggleBtn type="button" onClick={() => { setShowDay(false); emit({ year: selectedYear || viewYear, month: selectedMonth, day: null }); }}>
										<span>Clear day</span>
										<ToggleHint>month only</ToggleHint>
									</ToggleBtn>
								</>
							)}
						</DaySection>
					)}
				</Popover>
			)}
		</Anchor>
	);
};

// Convenience wrapper: ties a (year, month) pair (existing app contract) to the picker's
// internal { year, month, day } shape. Day is dropped on the way out.
export const MonthYearField = ({ year, month, onChange, ...rest }) => (
	<DatePicker
		value={{ year: parseInt(year, 10) || 0, month: parseInt(month, 10) || 0, day: null }}
		onChange={(next) => onChange(next.year ? String(next.year) : '0', pad2(next.month))}
		{...rest}
	/>
);

export default DatePicker;

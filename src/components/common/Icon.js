import React from "react";

// Inline SVG icon set. Avoids adding an icon dependency and avoids any unicode glyphs in UI.
// All icons are 24x24 by default and inherit currentColor for stroke.

const Svg = ({ size = 18, children, label, ...rest }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden={label ? undefined : "true"}
		role={label ? "img" : undefined}
		aria-label={label}
		{...rest}
	>
		{children}
	</svg>
);

export const PlusIcon = (p) => <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>;
export const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18"/></Svg>;
export const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></Svg>;
export const ChevronUpIcon = (p) => <Svg {...p}><path d="M6 15l6-6 6 6"/></Svg>;
export const ChevronDownIcon = (p) => <Svg {...p}><path d="M6 9l6 6 6-6"/></Svg>;
export const ChevronLeftIcon = (p) => <Svg {...p}><path d="M15 6l-6 6 6 6"/></Svg>;
export const ChevronRightIcon = (p) => <Svg {...p}><path d="M9 6l6 6-6 6"/></Svg>;
export const CalendarIcon = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></Svg>;
export const ExternalLinkIcon = (p) => <Svg {...p}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></Svg>;
export const TrashIcon = (p) => <Svg {...p}><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></Svg>;
export const UploadIcon = (p) => <Svg {...p}><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></Svg>;
export const ColumnsIcon = (p) => <Svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></Svg>;
export const SortIcon = (p) => <Svg {...p}><path d="M8 4v16M8 4l-3 3M8 4l3 3"/><path d="M16 20V4M16 20l-3-3M16 20l3-3"/></Svg>;

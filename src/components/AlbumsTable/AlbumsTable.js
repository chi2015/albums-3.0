import React, { useState, useMemo, useEffect, useRef } from "react";
import glamorous from "glamorous";
import { colors, motion, radius, shadow, type, breakpoints } from "../../styles/tokens";
import { imgUrl } from "../../config";
import { monthShort, monthLong } from "../../utils/months";
import { SearchIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon, ColumnsIcon } from "../common/Icon";
import IconButton from "../common/IconButton";

// ----- Layout ---------------------------------------------------------------

const Surface = glamorous.div({
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.lg,
	overflow: 'hidden',
	boxShadow: shadow.sm
});

const Toolbar = glamorous.div({
	display: 'flex',
	alignItems: 'center',
	gap: 10,
	padding: '12px 14px',
	borderBottom: `1px solid ${colors.borderSoft}`,
	background: colors.surfaceAlt,
	flexWrap: 'wrap'
});

const SearchWrap = glamorous.div({
	position: 'relative',
	flex: '1 1 240px',
	minWidth: 0,
	display: 'flex',
	alignItems: 'center'
});

const SearchInput = glamorous.input({
	...type.body,
	width: '100%',
	height: 36,
	padding: '0 12px 0 36px',
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.md,
	color: colors.ink,
	transition: `border-color ${motion.fast}, box-shadow ${motion.fast}`,
	':hover:not(:focus)': { borderColor: colors.borderStrong },
	':focus': { outline: 'none', borderColor: colors.accent, boxShadow: shadow.focus },
	'::placeholder': { color: colors.inkSubtle }
});

const SearchIconWrap = glamorous.div({
	position: 'absolute',
	left: 10,
	top: '50%',
	transform: 'translateY(-50%)',
	color: colors.inkMuted,
	pointerEvents: 'none',
	display: 'flex'
});

const ToolbarSpacer = glamorous.div({ flex: '1 1 auto' });

const Meta = glamorous.div({
	...type.bodySm,
	color: colors.inkMuted,
	whiteSpace: 'nowrap'
});

// ----- Table ----------------------------------------------------------------

const Scroll = glamorous.div({
	width: '100%',
	overflowX: 'auto'
});

const Table = glamorous.table({
	width: '100%',
	borderCollapse: 'collapse',
	tableLayout: 'fixed'
});

const Thead = glamorous.thead({
	background: colors.surface,
	borderBottom: `1px solid ${colors.borderSoft}`
});

const Th = glamorous.th(
	{
		...type.overline,
		color: colors.inkMuted,
		textAlign: 'left',
		padding: '10px 12px',
		fontWeight: 600,
		whiteSpace: 'nowrap',
		userSelect: 'none',
		borderBottom: `1px solid ${colors.borderSoft}`,
		background: colors.surfaceAlt
	},
	({ sortable, align }) => ({
		cursor: sortable ? 'pointer' : 'default',
		textAlign: align || 'left',
		':hover': sortable ? { color: colors.ink } : null
	})
);

const ThInner = glamorous.span({
	display: 'inline-flex',
	alignItems: 'center',
	gap: 4
});

const Tr = glamorous.tr(
	{
		borderBottom: `1px solid ${colors.borderSoft}`,
		transition: `background ${motion.fast}`,
		cursor: 'pointer',
		':hover': { background: colors.surfaceAlt }
	},
	({ selected }) => selected ? { background: colors.rowSelected, ':hover': { background: colors.rowSelected } } : null
);

const Td = glamorous.td(
	{
		...type.body,
		padding: '8px 12px',
		verticalAlign: 'middle',
		color: colors.ink,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
	({ muted, mono, align }) => ({
		color: muted ? colors.inkMuted : colors.ink,
		fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
		textAlign: align || 'left'
	})
);

const Cover = glamorous.div({
	width: 40,
	height: 40,
	borderRadius: radius.sm,
	overflow: 'hidden',
	background: colors.paperDeep,
	border: `1px solid ${colors.borderSoft}`,
	flexShrink: 0
});

const CoverImg = glamorous.img({ width: '100%', height: '100%', objectFit: 'cover', display: 'block' });

const ArtistText = glamorous.div({
	...type.body,
	fontWeight: 500,
	color: colors.ink,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
});

const TitleText = glamorous.div({
	...type.bodySm,
	color: colors.inkMuted,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	[breakpoints.phone]: { whiteSpace: 'normal' }
});

const StackedCell = glamorous.div({
	display: 'flex',
	alignItems: 'center',
	gap: 12,
	minWidth: 0
});

const StackedCellText = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0
});

// Footer / pagination -------------------------------------------------------

const Footer = glamorous.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '10px 14px',
	borderTop: `1px solid ${colors.borderSoft}`,
	background: colors.surfaceAlt,
	flexWrap: 'wrap',
	gap: 10
});

const PageBtns = glamorous.div({ display: 'inline-flex', alignItems: 'center', gap: 4 });

const PageBtn = glamorous.button(
	{
		...type.bodySm,
		minWidth: 30,
		height: 30,
		padding: '0 8px',
		borderRadius: radius.sm,
		border: `1px solid transparent`,
		background: 'transparent',
		color: colors.inkSoft,
		cursor: 'pointer',
		':hover:not(:disabled)': { background: colors.surface, borderColor: colors.borderSoft },
		':disabled': { opacity: 0.4, cursor: 'not-allowed' }
	},
	({ active }) => active ? { background: colors.accent, color: colors.accentInk, borderColor: colors.accent } : null
);

const PageSizeSelect = glamorous.select({
	...type.bodySm,
	height: 30,
	padding: '0 8px',
	borderRadius: radius.sm,
	border: `1px solid ${colors.border}`,
	background: colors.surface,
	color: colors.ink,
	cursor: 'pointer',
	':focus': { outline: 'none', borderColor: colors.accent, boxShadow: shadow.focus }
});

// Empty state ----------------------------------------------------------------

const Empty = glamorous.div({
	padding: '48px 16px',
	textAlign: 'center'
});

const EmptyHead = glamorous.div({
	...type.heading,
	marginBottom: 4,
	color: colors.ink
});

const EmptyBody = glamorous.div({
	...type.body,
	color: colors.inkMuted
});

// Columns popover ------------------------------------------------------------

const ColumnsAnchor = glamorous.div({ position: 'relative', display: 'inline-block' });

const ColumnsPanel = glamorous.div({
	position: 'absolute',
	top: 'calc(100% + 6px)',
	right: 0,
	zIndex: 50,
	minWidth: 180,
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.md,
	boxShadow: shadow.lg,
	padding: 6,
	display: 'flex',
	flexDirection: 'column'
});

const ColumnsItem = glamorous.label({
	...type.bodySm,
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	padding: '6px 8px',
	borderRadius: radius.sm,
	cursor: 'pointer',
	':hover': { background: colors.surfaceAlt }
});

// External link cell --------------------------------------------------------

const LinkCell = glamorous.a({
	display: 'inline-flex',
	alignItems: 'center',
	gap: 4,
	padding: '4px 6px',
	borderRadius: radius.sm,
	color: colors.inkSoft,
	textDecoration: 'none',
	border: `1px solid ${colors.borderSoft}`,
	background: colors.surface,
	transition: `background ${motion.fast}, color ${motion.fast}, border-color ${motion.fast}`,
	':hover': { background: colors.accentSoft, color: colors.accentHover, borderColor: colors.accent, textDecoration: 'none' }
});

// ----- Component ------------------------------------------------------------

const COLUMN_DEFS = [
	{ key: 'cover', label: '', sortable: false, hideable: false, width: 60 },
	{ key: 'artist', label: 'Artist / Title', sortable: true, sortField: 'artist', hideable: false, width: 'auto' },
	{ key: 'year', label: 'Year', sortable: true, sortField: 'year', hideable: true, width: 80, align: 'left' },
	{ key: 'month', label: 'Month', sortable: true, sortField: 'month', hideable: true, width: 110, align: 'left' },
	{ key: 'copyright', label: 'Copyright', sortable: true, sortField: 'copyright', hideable: true, width: 200 },
	{ key: 'itunes', label: 'iTunes', sortable: false, hideable: true, width: 90, align: 'left' }
];

const SORT_DEFAULT = { field: 'year', dir: 'desc' };
const PAGE_SIZE_DEFAULT = 25;

const AlbumsTable = ({ albums, openEditModal, selectedId, onSelect }) => {
	const [query, setQuery] = useState('');
	const [sort, setSort] = useState(SORT_DEFAULT);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
	const [hidden, setHidden] = useState(() => new Set());
	const [columnsOpen, setColumnsOpen] = useState(false);
	const columnsBtnRef = useRef(null);
	const columnsPanelRef = useRef(null);

	// Reset pagination when filter or dataset changes — page might no longer exist.
	useEffect(() => { setPage(1); }, [query, albums.length]);

	useEffect(() => {
		if (!columnsOpen) return;
		const onDown = (e) => {
			if (columnsPanelRef.current && columnsPanelRef.current.contains(e.target)) return;
			if (columnsBtnRef.current && columnsBtnRef.current.contains(e.target)) return;
			setColumnsOpen(false);
		};
		document.addEventListener('mousedown', onDown);
		return () => document.removeEventListener('mousedown', onDown);
	}, [columnsOpen]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return albums;
		return albums.filter(a => {
			const blob = `${a.artist || ''}|${a.title || ''}|${a.copyright || ''}|${a.year || ''}|${monthLong(a.month)}`.toLowerCase();
			return blob.indexOf(q) !== -1;
		});
	}, [albums, query]);

	const sorted = useMemo(() => {
		const list = filtered.slice();
		const { field, dir } = sort;
		const m = dir === 'asc' ? 1 : -1;
		list.sort((a, b) => {
			let av = a[field], bv = b[field];
			if (field === 'year' || field === 'month') {
				av = parseInt(av, 10) || 0; bv = parseInt(bv, 10) || 0;
				if (av !== bv) return (av - bv) * m;
				// Stable secondary sort by artist asc to keep ties readable.
				return (a.artist || '').localeCompare(b.artist || '');
			}
			av = (av || '').toString().toLowerCase();
			bv = (bv || '').toString().toLowerCase();
			if (av < bv) return -1 * m;
			if (av > bv) return 1 * m;
			return 0;
		});
		return list;
	}, [filtered, sort]);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const safePage = Math.min(page, totalPages);
	const pageStart = (safePage - 1) * pageSize;
	const pageEnd = Math.min(pageStart + pageSize, sorted.length);
	const pageRows = sorted.slice(pageStart, pageEnd);

	const toggleSort = (field) => {
		setSort(prev => {
			if (prev.field !== field) return { field, dir: field === 'year' ? 'desc' : 'asc' };
			return { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
		});
	};

	const toggleHidden = (key) => {
		setHidden(prev => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});
	};

	const visibleCols = COLUMN_DEFS.filter(c => !hidden.has(c.key));
	const hideableCols = COLUMN_DEFS.filter(c => c.hideable);

	const renderSortIcon = (col) => {
		if (!col.sortable) return null;
		const active = sort.field === col.sortField;
		if (!active) return <ChevronDownIcon size={12} style={{ opacity: 0.4 }} />;
		return sort.dir === 'asc' ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />;
	};

	const handleRowClick = (album) => {
		onSelect && onSelect(album.id);
		openEditModal(album);
	};

	return (
		<Surface>
			<Toolbar>
				<SearchWrap>
					<SearchIconWrap><SearchIcon size={16} /></SearchIconWrap>
					<SearchInput
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Search artist, title, copyright"
						aria-label="Search albums"
					/>
				</SearchWrap>
				<ToolbarSpacer />
				<Meta>{sorted.length} {sorted.length === 1 ? 'album' : 'albums'}</Meta>
				<ColumnsAnchor>
					<IconButton
						ref={columnsBtnRef}
						icon={<ColumnsIcon size={16} />}
						label="Toggle columns"
						onClick={() => setColumnsOpen(o => !o)}
					/>
					{columnsOpen && (
						<ColumnsPanel innerRef={columnsPanelRef}>
							{hideableCols.map(c => (
								<ColumnsItem key={c.key}>
									<input
										type="checkbox"
										checked={!hidden.has(c.key)}
										onChange={() => toggleHidden(c.key)}
									/>
									{c.label || c.key}
								</ColumnsItem>
							))}
						</ColumnsPanel>
					)}
				</ColumnsAnchor>
			</Toolbar>

			<Scroll>
				<Table>
					<colgroup>
						{visibleCols.map(c => <col key={c.key} style={{ width: typeof c.width === 'number' ? `${c.width}px` : c.width }} />)}
					</colgroup>
					<Thead>
						<tr>
							{visibleCols.map(c => (
								<Th
									key={c.key}
									sortable={c.sortable}
									align={c.align}
									onClick={() => c.sortable && toggleSort(c.sortField)}
								>
									<ThInner>
										{c.label}
										{renderSortIcon(c)}
									</ThInner>
								</Th>
							))}
						</tr>
					</Thead>
					<tbody>
						{pageRows.length === 0 ? (
							<tr>
								<td colSpan={visibleCols.length}>
									<Empty>
										<EmptyHead>No matching albums</EmptyHead>
										<EmptyBody>{query ? 'Try a different search term or clear the filter.' : 'No albums in the chosen date range.'}</EmptyBody>
									</Empty>
								</td>
							</tr>
						) : pageRows.map(album => (
							<Tr
								key={album.id}
								selected={album.id === selectedId}
								onClick={() => handleRowClick(album)}
								tabIndex={0}
								onKeyDown={e => { if (e.key === 'Enter') handleRowClick(album); }}
							>
								{visibleCols.map(c => {
									switch (c.key) {
										case 'cover':
											return (
												<Td key="cover">
													<Cover>
														<CoverImg src={imgUrl + (album.cover || 'cd1.jpg')} alt="" loading="lazy" />
													</Cover>
												</Td>
											);
										case 'artist':
											return (
												<Td key="artist">
													<StackedCell>
														<StackedCellText>
															<ArtistText>{album.artist || '—'}</ArtistText>
															<TitleText>{album.title || '—'}</TitleText>
														</StackedCellText>
													</StackedCell>
												</Td>
											);
										case 'year':
											return <Td key="year" mono>{album.year || ''}</Td>;
										case 'month':
											return <Td key="month">{monthShort(album.month) || ''}</Td>;
										case 'copyright':
											return <Td key="copyright" muted>{album.copyright || ''}</Td>;
										case 'itunes':
											return (
												<Td key="itunes">
													{album.itunes_link ? (
														<LinkCell
															href={album.itunes_link}
															target="_blank"
															rel="noreferrer noopener"
															onClick={e => e.stopPropagation()}
															aria-label="Open in iTunes"
														>
															<ExternalLinkIcon size={14} />
															Open
														</LinkCell>
													) : null}
												</Td>
											);
										default:
											return <Td key={c.key} />;
									}
								})}
							</Tr>
						))}
					</tbody>
				</Table>
			</Scroll>

			<Footer>
				<Meta>
					{sorted.length === 0 ? '0' : `${pageStart + 1}–${pageEnd}`} of {sorted.length}
				</Meta>
				<PageBtns>
					<IconButton
						icon={<ChevronLeftIcon size={16} />}
						label="Previous page"
						onClick={() => setPage(p => Math.max(1, p - 1))}
						disabled={safePage <= 1}
					/>
					{buildPageRange(safePage, totalPages).map((p, i) =>
						p === '…'
							? <PageBtn key={`g${i}`} disabled>…</PageBtn>
							: <PageBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PageBtn>
					)}
					<IconButton
						icon={<ChevronRightIcon size={16} />}
						label="Next page"
						onClick={() => setPage(p => Math.min(totalPages, p + 1))}
						disabled={safePage >= totalPages}
					/>
				</PageBtns>
				<PageSizeSelect value={pageSize} onChange={e => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}>
					{[25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
				</PageSizeSelect>
			</Footer>
		</Surface>
	);
};

// Compact pagination range: always shows first/last and a window around current.
function buildPageRange(current, total) {
	if (total <= 7) {
		const out = [];
		for (let i = 1; i <= total; i++) out.push(i);
		return out;
	}
	const range = new Set([1, total, current - 1, current, current + 1]);
	const out = [];
	let prev = 0;
	[...range].filter(n => n >= 1 && n <= total).sort((a, b) => a - b).forEach(n => {
		if (n - prev > 1) out.push('…');
		out.push(n);
		prev = n;
	});
	return out;
}

export default AlbumsTable;

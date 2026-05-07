import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import glamorous from "glamorous";
import superagent from "superagent";
import { colors, motion, radius, shadow, type, z, breakpoints } from "../../styles/tokens";
import { serverUrlNew, imgUrl } from "../../config";
import request from "../../request";
import { pad2 } from "../../utils/months";
import Button from "../common/Button";
import IconButton from "../common/IconButton";
import TextField from "../common/TextField";
import { CloseIcon, TrashIcon, UploadIcon } from "../common/Icon";
import { MonthYearField } from "../DatePicker/DatePicker";

// ----- Layout ---------------------------------------------------------------

const Backdrop = glamorous.div(
	{
		position: 'fixed',
		top: 0, right: 0, bottom: 0, left: 0,
		background: colors.overlay,
		zIndex: z.overlay,
		opacity: 0,
		transition: `opacity ${motion.med}`
	},
	({ open }) => open ? { opacity: 1 } : { pointerEvents: 'none' }
);

const Panel = glamorous.aside(
	{
		position: 'fixed',
		top: 0,
		right: 0,
		bottom: 0,
		width: 'min(540px, 100vw)',
		background: colors.surface,
		borderLeft: `1px solid ${colors.border}`,
		boxShadow: shadow.lg,
		zIndex: z.drawer,
		display: 'flex',
		flexDirection: 'column',
		transform: 'translateX(100%)',
		transition: `transform ${motion.med}`,
		[breakpoints.phone]: { width: '100vw', borderLeft: 0 }
	},
	// When closed, the panel is fully translated offscreen — disable pointer events so it
	// can't intercept clicks at the right edge of the viewport during transition.
	({ open }) => open ? { transform: 'translateX(0)' } : { pointerEvents: 'none' }
);

const Header = glamorous.div({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	padding: '14px 16px',
	borderBottom: `1px solid ${colors.borderSoft}`,
	background: colors.surfaceAlt
});

const HeaderTitle = glamorous.div({
	...type.heading,
	flex: '1 1 auto',
	color: colors.ink
});

const HeaderSub = glamorous.div({
	...type.bodySm,
	color: colors.inkMuted,
	marginTop: 2
});

const Body = glamorous.div({
	flex: '1 1 auto',
	overflowY: 'auto',
	padding: '20px 22px 28px',
	display: 'flex',
	flexDirection: 'column',
	gap: 24
});

const Section = glamorous.section({
	display: 'flex',
	flexDirection: 'column',
	gap: 12
});

const SectionTitle = glamorous.div({
	...type.overline,
	color: colors.inkMuted,
	paddingBottom: 6,
	borderBottom: `1px solid ${colors.borderSoft}`,
	marginBottom: 4
});

const Footer = glamorous.div({
	position: 'sticky',
	bottom: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 8,
	padding: '14px 16px',
	borderTop: `1px solid ${colors.borderSoft}`,
	background: colors.surface,
	boxShadow: '0 -8px 16px rgba(40, 30, 15, 0.04)'
});

const FooterRight = glamorous.div({ display: 'inline-flex', gap: 8 });

const FieldLabel = glamorous.span({ ...type.label, color: colors.inkSoft, marginBottom: 4, display: 'block' });

// Cover uploader -------------------------------------------------------------

const CoverWrap = glamorous.div({
	display: 'flex',
	gap: 14,
	alignItems: 'flex-start'
});

const CoverPreview = glamorous.div({
	width: 132,
	height: 132,
	borderRadius: radius.md,
	border: `1px dashed ${colors.border}`,
	background: colors.paperDeep,
	overflow: 'hidden',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	position: 'relative'
});

const CoverImg = glamorous.img({ width: '100%', height: '100%', objectFit: 'cover', display: 'block' });

const CoverPlaceholder = glamorous.div({
	...type.overline,
	color: colors.inkSubtle,
	textAlign: 'center'
});

const CoverActions = glamorous.div({
	flex: '1 1 auto',
	display: 'flex',
	flexDirection: 'column',
	gap: 8,
	minWidth: 0
});

const CoverHint = glamorous.div({
	...type.bodySm,
	color: colors.inkMuted
});

const HiddenFile = glamorous.input({
	position: 'absolute',
	opacity: 0,
	width: 0,
	height: 0,
	pointerEvents: 'none'
});

// Banner --------------------------------------------------------------------

const Banner = glamorous.div(
	{
		...type.bodySm,
		padding: '8px 12px',
		borderRadius: radius.md,
		background: colors.dangerSoft,
		color: colors.dangerHover,
		border: `1px solid ${colors.danger}`
	},
	({ tone }) => tone === 'info' ? {
		background: colors.accentSoft,
		color: colors.accentHover,
		borderColor: colors.accent
	} : null
);

// Confirm dialog -------------------------------------------------------------

const ConfirmShade = glamorous.div({
	position: 'absolute',
	top: 0, right: 0, bottom: 0, left: 0,
	background: 'rgba(26, 22, 17, 0.32)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 16,
	animation: `confirmFade ${motion.fast} forwards`,
	'@keyframes confirmFade': { from: { opacity: 0 }, to: { opacity: 1 } }
});

const ConfirmCard = glamorous.div({
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.lg,
	padding: 18,
	maxWidth: 360,
	boxShadow: shadow.lg,
	display: 'flex',
	flexDirection: 'column',
	gap: 12
});

const ConfirmTitle = glamorous.div({ ...type.heading, color: colors.ink });
const ConfirmBody = glamorous.div({ ...type.body, color: colors.inkSoft });
const ConfirmActions = glamorous.div({ display: 'flex', justifyContent: 'flex-end', gap: 8 });

// ----- Component ------------------------------------------------------------

const blankForm = (year, month) => ({
	artist: '',
	title: '',
	year: String(year),
	month: pad2(month),
	itunes_link: '',
	copyright: '',
	pass: ''
});

const fromAlbum = (album, fallbackYear, fallbackMonth) => ({
	artist: album?.artist || '',
	title: album?.title || '',
	year: album?.year ? String(album.year) : String(fallbackYear),
	month: album?.month ? pad2(album.month) : pad2(fallbackMonth),
	itunes_link: album?.itunes_link || '',
	copyright: album?.copyright || '',
	pass: ''
});

const AlbumDrawer = ({
	open,
	mode,
	album,
	year,
	month,
	onClose,
	onSaved,
	onError
}) => {
	const initialForm = useMemo(
		() => mode === 'edit' ? fromAlbum(album, year, month) : blankForm(year, month),
		// Re-init when the drawer opens with a new context.
		[open, mode, album]  // eslint-disable-line react-hooks/exhaustive-deps
	);

	const [form, setForm] = useState(initialForm);
	const [errors, setErrors] = useState({});
	const [coverPreview, setCoverPreview] = useState(null);
	const [coverFile, setCoverFile] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [confirm, setConfirm] = useState(null); // 'discard' | 'delete' | null
	const [submitError, setSubmitError] = useState('');

	const fileInputRef = useRef(null);
	const firstFieldRef = useRef(null);
	const panelRef = useRef(null);

	// Reset on each open: blank for add, prefilled for edit. Cover preview comes from
	// the existing album.cover (if any) — file is only set when the user picks a new one.
	useEffect(() => {
		if (!open) return;
		setForm(initialForm);
		setErrors({});
		setSubmitError('');
		setCoverFile(null);
		setCoverPreview(mode === 'edit' && album?.cover ? imgUrl + album.cover : null);
		setConfirm(null);
		// Auto-focus the first field after the slide-in starts so it doesn't fight the animation.
		const t = setTimeout(() => { firstFieldRef.current && firstFieldRef.current.focus(); }, 220);
		return () => clearTimeout(t);
	}, [open, initialForm, mode, album]);

	// Keyboard: Esc closes (with dirty-check), Cmd/Ctrl+Enter submits.
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				attemptClose();
			} else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
				e.preventDefault();
				submit();
			}
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, form, coverFile]);

	const isDirty = useCallback(() => {
		if (coverFile) return true;
		const keys = ['artist','title','year','month','itunes_link','copyright','pass'];
		return keys.some(k => (form[k] || '') !== (initialForm[k] || ''));
	}, [form, coverFile, initialForm]);

	const setField = (k) => (e) => {
		const v = e && e.target ? e.target.value : e;
		setForm(prev => ({ ...prev, [k]: v }));
		if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
	};

	const setDate = (yr, mo) => {
		setForm(prev => ({ ...prev, year: yr, month: mo }));
		if (errors.year || errors.month) setErrors(prev => ({ ...prev, year: null, month: null }));
	};

	const validate = () => {
		const e = {};
		if (!form.artist.trim()) e.artist = 'Artist is required';
		if (!form.title.trim()) e.title = 'Title is required';
		if (!/^[0-9]{4}$/.test(form.year || '')) e.year = 'Year must be 4 digits';
		if (!/^(0[1-9]|1[0-2])$/.test(form.month || '')) e.month = 'Pick a specific month';
		if (form.itunes_link && !/^https?:\/\//i.test(form.itunes_link)) e.itunes_link = 'Must start with http(s)://';
		if (!form.pass) e.pass = 'Edit password is required';
		return e;
	};

	const submit = () => {
		const e = validate();
		setErrors(e);
		if (Object.keys(e).length) {
			setSubmitError('Please correct the highlighted fields.');
			// Focus first field with an error for keyboard users.
			const firstErr = ['artist','title','year','month','itunes_link','pass'].find(k => e[k]);
			if (firstErr) {
				const node = panelRef.current && panelRef.current.querySelector(`[name="${firstErr}"]`);
				node && node.focus();
			}
			return;
		}
		setSubmitError('');
		setSubmitting(true);

		// Multipart submit via superagent — preserves the existing cover-upload contract.
		const req = superagent.post(serverUrlNew);
		req.field('action', mode);
		if (mode === 'edit' && album?.id) req.field('id', album.id);
		req.field('year', form.year);
		req.field('month', form.month);
		req.field('artist', form.artist);
		req.field('title', form.title);
		req.field('itunes_link', form.itunes_link);
		req.field('copyright', form.copyright);
		req.field('pass', form.pass);
		if (coverFile) req.attach('cover', coverFile);
		else if (mode === 'edit' && album?.cover) req.field('cover', album.cover);

		req.then(res => {
			setSubmitting(false);
			if (res.body && res.body.ok) onSaved && onSaved(res.body);
			else if (res.body && res.body.error) {
				setSubmitError(res.body.error);
				onError && onError(res.body.error, false);
			} else {
				setSubmitError('Unknown server response');
			}
		}).catch(() => {
			setSubmitting(false);
			setSubmitError('Network error. Please try again.');
		});
	};

	const handleCoverPick = (e) => {
		const f = e.target.files && e.target.files[0];
		if (!f) return;
		setCoverFile(f);
		const reader = new FileReader();
		reader.onload = (ev) => setCoverPreview(ev.target.result);
		reader.readAsDataURL(f);
	};

	const browseCover = () => fileInputRef.current && fileInputRef.current.click();

	const attemptClose = () => {
		if (submitting) return;
		if (isDirty()) setConfirm('discard');
		else onClose && onClose();
	};

	const confirmDelete = () => setConfirm('delete');

	const performDelete = () => {
		if (!album?.id) return;
		if (!form.pass) {
			setErrors(prev => ({ ...prev, pass: 'Edit password is required to delete' }));
			setConfirm(null);
			return;
		}
		setSubmitting(true);
		request({ action: 'delete', id: album.id, pass: form.pass }).then(data => {
			setSubmitting(false);
			setConfirm(null);
			if (data && data.ok) onSaved && onSaved(data);
			else if (data && data.error) setSubmitError(data.error);
			else setSubmitError('Unknown error during delete');
		}).catch(() => {
			setSubmitting(false);
			setConfirm(null);
			setSubmitError('Network error. Please try again.');
		});
	};

	const headerTitle = mode === 'edit' ? 'Edit album' : 'Add album';
	const headerSub = mode === 'edit'
		? (album?.artist ? `${album.artist}${album.title ? ' — ' + album.title : ''}` : '')
		: 'Fill in the details and save to add a new album.';

	return (
		<>
			<Backdrop open={open} onClick={attemptClose} />
			<Panel open={open} innerRef={panelRef} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={headerTitle}>
				<Header>
					<div style={{ flex: '1 1 auto', minWidth: 0 }}>
						<HeaderTitle>{headerTitle}</HeaderTitle>
						{headerSub && <HeaderSub>{headerSub}</HeaderSub>}
					</div>
					<IconButton icon={<CloseIcon size={18} />} label="Close" onClick={attemptClose} />
				</Header>

				<Body>
					{submitError && <Banner role="alert">{submitError}</Banner>}

					<Section>
						<SectionTitle>Basic info</SectionTitle>
						<TextField
							ref={firstFieldRef}
							name="artist"
							label="Artist"
							placeholder="e.g. Talk Talk"
							value={form.artist}
							onChange={setField('artist')}
							error={errors.artist}
							autoComplete="off"
						/>
						<TextField
							name="title"
							label="Title"
							placeholder="e.g. Spirit of Eden"
							value={form.title}
							onChange={setField('title')}
							error={errors.title}
							autoComplete="off"
						/>
					</Section>

					<Section>
						<SectionTitle>Release details</SectionTitle>
						<div>
							<FieldLabel>Release date</FieldLabel>
							{/* Drawer requires a concrete year+month (cannot be "all"), so disable the all-* toggles. */}
							<MonthYearField
								year={form.year}
								month={form.month}
								onChange={setDate}
								allowAllMonths={false}
								allowAllYears={false}
								allowAllTime={false}
								placeholder="Choose month and year"
							/>
							{(errors.year || errors.month) && (
								<div style={{ marginTop: 4, color: colors.danger, fontSize: 13 }}>
									{errors.year || errors.month}
								</div>
							)}
						</div>
						<TextField
							name="itunes_link"
							label="iTunes link"
							placeholder="https://music.apple.com/..."
							value={form.itunes_link}
							onChange={setField('itunes_link')}
							error={errors.itunes_link}
							hint="Optional"
							autoComplete="off"
						/>
						<TextField
							name="copyright"
							label="Copyright"
							placeholder="e.g. (P) 1988 EMI Records"
							value={form.copyright}
							onChange={setField('copyright')}
							hint="Optional"
							autoComplete="off"
						/>
					</Section>

					<Section>
						<SectionTitle>Cover art</SectionTitle>
						<CoverWrap>
							<CoverPreview onClick={browseCover} role="button" tabIndex={0}
								onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); browseCover(); } }}
							>
								{coverPreview
									? <CoverImg src={coverPreview} alt="" />
									: <CoverPlaceholder>No cover<br/>set</CoverPlaceholder>}
							</CoverPreview>
							<CoverActions>
								<Button kind="secondary" size="md" leadingIcon={<UploadIcon size={16} />} onClick={browseCover} type="button">
									{coverPreview ? 'Replace cover' : 'Upload cover'}
								</Button>
								{coverPreview && (
									<Button kind="ghost" size="sm" type="button" onClick={() => { setCoverPreview(null); setCoverFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
										Remove cover
									</Button>
								)}
								<CoverHint>JPG, PNG, or GIF. Saved at the original aspect ratio.</CoverHint>
								<HiddenFile
									innerRef={fileInputRef}
									type="file"
									accept=".jpg,.jpeg,.png,.gif"
									onChange={handleCoverPick}
								/>
							</CoverActions>
						</CoverWrap>
					</Section>

					<Section>
						<SectionTitle>Authorization</SectionTitle>
						<TextField
							name="pass"
							label="Edit password"
							type="password"
							value={form.pass}
							onChange={setField('pass')}
							error={errors.pass}
							hint="Required to save changes."
							autoComplete="current-password"
						/>
					</Section>
				</Body>

				<Footer>
					<div>
						{mode === 'edit' && (
							<Button kind="danger" size="md" leadingIcon={<TrashIcon size={16} />} onClick={confirmDelete} disabled={submitting} type="button">
								Delete
							</Button>
						)}
					</div>
					<FooterRight>
						<Button kind="ghost" onClick={attemptClose} disabled={submitting} type="button">Cancel</Button>
						<Button kind="primary" onClick={submit} disabled={submitting} type="button">
							{submitting ? 'Saving…' : (mode === 'edit' ? 'Save changes' : 'Add album')}
						</Button>
					</FooterRight>
				</Footer>

				{confirm && (
					<ConfirmShade>
						<ConfirmCard role="alertdialog" aria-modal="true">
							{confirm === 'discard' ? (
								<>
									<ConfirmTitle>Discard changes?</ConfirmTitle>
									<ConfirmBody>You have unsaved changes. Closing now will discard them.</ConfirmBody>
									<ConfirmActions>
										<Button kind="ghost" onClick={() => setConfirm(null)} type="button">Keep editing</Button>
										<Button kind="dangerSolid" onClick={() => { setConfirm(null); onClose && onClose(); }} type="button">Discard</Button>
									</ConfirmActions>
								</>
							) : (
								<>
									<ConfirmTitle>Delete this album?</ConfirmTitle>
									<ConfirmBody>This action cannot be undone. The album record and its cover will be removed.</ConfirmBody>
									<ConfirmActions>
										<Button kind="ghost" onClick={() => setConfirm(null)} type="button">Cancel</Button>
										<Button kind="dangerSolid" onClick={performDelete} type="button">Delete</Button>
									</ConfirmActions>
								</>
							)}
						</ConfirmCard>
					</ConfirmShade>
				)}
			</Panel>
		</>
	);
};

export default AlbumDrawer;

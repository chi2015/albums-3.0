import React, { useState, useEffect } from "react";
import glamorous from "glamorous";
import Modal from "react-modal";

import "../../styles/global"; // Side-effect: install global styles before first paint.
import { colors, type, breakpoints, radius } from "../../styles/tokens";
import { pad2 } from "../../utils/months";
import request from "../../request";

import Header from "./Header";
import Content from "./Content";
import AlbumDrawer from "../AlbumDrawer/AlbumDrawer";
import Button from "../common/Button";

const Page = glamorous.div({
	maxWidth: 1180,
	margin: '0 auto',
	padding: '0 24px 32px',
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	[breakpoints.phone]: { padding: '0 12px 24px' }
});

const Footer = glamorous.footer({
	...type.bodySm,
	color: colors.inkSubtle,
	textAlign: 'center',
	padding: '24px 0 8px',
	marginTop: 'auto'
});

const errorModalStyles = {
	overlay: { zIndex: 1100 },
	content: {
		top: '50%', left: '50%', right: 'auto', bottom: 'auto',
		transform: 'translate(-50%, -50%)',
		minWidth: 320, maxWidth: 480,
		borderRadius: radius.lg,
		display: 'flex', flexDirection: 'column', gap: 12
	}
};

const ErrorTitle = glamorous.h3({ ...type.heading, marginBottom: 4 });
const ErrorBody = glamorous.p({ ...type.body, color: colors.inkSoft });
const ErrorActions = glamorous.div({ display: 'flex', justifyContent: 'flex-end', marginTop: 8 });

const Layout = () => {
	const d = new Date();
	const [year, setYear] = useState(String(d.getFullYear() - 1));
	const [month, setMonth] = useState(pad2(d.getMonth() + 1));
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [mode, setMode] = useState('add');
	const [albums, setAlbums] = useState([]);
	const [album, setAlbum] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [errorOpen, setErrorOpen] = useState(false);
	const [errorText, setErrorText] = useState('');

	useEffect(() => { Modal.setAppElement('body'); }, []);

	useEffect(() => {
		if (!loading) return;
		request({ action: 'list', year, month }).then(data => {
			if (data && data.ok && Array.isArray(data.albums)) {
				setAlbums(data.albums);
			} else {
				setAlbums([]);
				setErrorText((data && data.error) || 'Error loading albums');
				setErrorOpen(true);
			}
		}).catch(() => {
			setAlbums([]);
			setErrorText('Error loading albums');
			setErrorOpen(true);
		}).finally(() => setLoading(false));
	}, [loading, year, month]);

	useEffect(() => { setLoading(true); }, [year, month]);

	const changeDate = (y, m) => { setYear(String(y)); setMonth(pad2(m)); };

	const openAdd = () => {
		setMode('add');
		setAlbum(null);
		setDrawerOpen(true);
	};

	const openEdit = (item) => {
		setMode('edit');
		setAlbum(item);
		setSelectedId(item.id);
		setDrawerOpen(true);
	};

	const closeDrawer = () => {
		setDrawerOpen(false);
		setSelectedId(null);
	};

	const onSaved = (response) => {
		setDrawerOpen(false);
		setSelectedId(null);
		// If the server echoed back a year/month (add and edit do), jump the filter to
		// that date so the just-saved album is visible. The year/month effect will then
		// trigger the reload, so we don't also flip `loading` here in that branch.
		if (response && response.year && response.month) {
			const nextYear = String(response.year);
			const nextMonth = pad2(response.month);
			if (nextYear !== year || nextMonth !== month) {
				setYear(nextYear);
				setMonth(nextMonth);
				return;
			}
		}
		setLoading(true);
	};

	const onDrawerError = (msg) => {
		setErrorText(msg);
		setErrorOpen(true);
	};

	return (
		<Page>
			<Header
				year={year}
				month={month}
				changeDate={changeDate}
				onAdd={openAdd}
			/>
			<Content
				loading={loading}
				albums={albums}
				openEditModal={openEdit}
				onAdd={openAdd}
				selectedId={selectedId}
				onSelect={setSelectedId}
			/>

			<AlbumDrawer
				open={drawerOpen}
				mode={mode}
				album={album}
				year={year}
				month={month}
				onClose={closeDrawer}
				onSaved={onSaved}
				onError={onDrawerError}
			/>

			<Modal
				isOpen={errorOpen}
				onRequestClose={() => setErrorOpen(false)}
				style={errorModalStyles}
				closeTimeoutMS={200}
			>
				<ErrorTitle>Something went wrong</ErrorTitle>
				<ErrorBody>{errorText}</ErrorBody>
				<ErrorActions><Button kind="primary" onClick={() => setErrorOpen(false)}>OK</Button></ErrorActions>
			</Modal>

			<Footer>Albums Calendar Catalog</Footer>
		</Page>
	);
};

export default Layout;

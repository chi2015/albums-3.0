import React from "react";
import glamorous from "glamorous";
import { colors, type, radius } from "../../styles/tokens";
import AlbumsTable from "../AlbumsTable/AlbumsTable";
import Button from "../common/Button";
import { PlusIcon } from "../common/Icon";

const Wrap = glamorous.div({ display: 'flex', flexDirection: 'column', flex: '1 1 auto' });

const StateCard = glamorous.div({
	background: colors.surface,
	border: `1px solid ${colors.border}`,
	borderRadius: radius.lg,
	padding: '56px 24px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 8
});

const StateTitle = glamorous.div({ ...type.display2, color: colors.ink });
const StateBody = glamorous.div({ ...type.body, color: colors.inkMuted, marginBottom: 8 });

// Animated row of bars — communicates "loading" without using emoji or unicode glyphs.
const SkeletonRow = glamorous.div({
	width: '100%',
	maxWidth: 320,
	height: 8,
	background: colors.borderSoft,
	borderRadius: radius.pill,
	overflow: 'hidden',
	position: 'relative',
	'::after': {
		content: '""',
		position: 'absolute',
		top: 0, left: '-40%',
		width: '40%',
		height: '100%',
		background: `linear-gradient(90deg, transparent, ${colors.paperDeep}, transparent)`,
		animation: 'skel 1.2s linear infinite'
	},
	'@keyframes skel': {
		from: { left: '-40%' },
		to: { left: '100%' }
	}
});

const SkeletonStack = glamorous.div({ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' });

const Loading = () => (
	<StateCard>
		<StateTitle>Loading albums</StateTitle>
		<StateBody>Fetching the catalog for the chosen date.</StateBody>
		<SkeletonStack>
			<SkeletonRow style={{ maxWidth: 360 }} />
			<SkeletonRow style={{ maxWidth: 280 }} />
			<SkeletonRow style={{ maxWidth: 320 }} />
		</SkeletonStack>
	</StateCard>
);

const Empty = ({ onAdd }) => (
	<StateCard>
		<StateTitle>No albums in this period</StateTitle>
		<StateBody>Add the first album for this month and year, or pick a different date above.</StateBody>
		<Button kind="primary" leadingIcon={<PlusIcon size={16} />} onClick={onAdd}>Add an album</Button>
	</StateCard>
);

const Content = ({ loading, albums, openEditModal, onAdd, selectedId, onSelect }) => (
	<Wrap>
		{loading
			? <Loading />
			: albums.length
				? <AlbumsTable albums={albums} openEditModal={openEditModal} selectedId={selectedId} onSelect={onSelect} />
				: <Empty onAdd={onAdd} />}
	</Wrap>
);

export default Content;

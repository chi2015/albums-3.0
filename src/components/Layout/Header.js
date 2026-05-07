import React from "react";
import glamorous from "glamorous";
import { colors, type, breakpoints } from "../../styles/tokens";
import { MonthYearField } from "../DatePicker/DatePicker";
import Button from "../common/Button";
import { PlusIcon } from "../common/Icon";

const Bar = glamorous.header({
	display: 'flex',
	alignItems: 'flex-end',
	justifyContent: 'space-between',
	gap: 16,
	padding: '24px 0 16px',
	borderBottom: `1px solid ${colors.borderSoft}`,
	marginBottom: 18,
	flexWrap: 'wrap'
});

const TitleBlock = glamorous.div({
	display: 'flex',
	flexDirection: 'column',
	gap: 4,
	minWidth: 0
});

const Title = glamorous.h1({
	...type.display1,
	[breakpoints.phone]: { fontSize: 28 }
});

const Subtitle = glamorous.div({
	...type.bodySm,
	color: colors.inkMuted
});

const Actions = glamorous.div({
	display: 'flex',
	gap: 8,
	alignItems: 'center',
	flexWrap: 'wrap'
});

const Header = ({ year, month, changeDate, onAdd }) => (
	<Bar>
		<TitleBlock>
			<Title>Albums Calendar Catalog</Title>
			<Subtitle>Browse, filter, and curate your monthly album picks.</Subtitle>
		</TitleBlock>
		<Actions>
			<MonthYearField
				year={year}
				month={month}
				onChange={(y, m) => changeDate(y, m)}
				allowAllMonths
				allowAllYears
				allowAllTime
				placeholder="Any time"
			/>
			<Button kind="primary" leadingIcon={<PlusIcon size={16} />} onClick={onAdd}>
				Add album
			</Button>
		</Actions>
	</Bar>
);

export default Header;

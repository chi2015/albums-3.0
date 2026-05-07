// Single source of truth for month metadata. The data layer stores month as a 2-digit
// string ("01"–"12"), with "00" reserved for "all months". Helpers here normalize between
// number and string forms so components don't have to repeat the slice/pad logic.

export const MONTHS = [
	{ num: 1, short: 'Jan', long: 'January' },
	{ num: 2, short: 'Feb', long: 'February' },
	{ num: 3, short: 'Mar', long: 'March' },
	{ num: 4, short: 'Apr', long: 'April' },
	{ num: 5, short: 'May', long: 'May' },
	{ num: 6, short: 'Jun', long: 'June' },
	{ num: 7, short: 'Jul', long: 'July' },
	{ num: 8, short: 'Aug', long: 'August' },
	{ num: 9, short: 'Sep', long: 'September' },
	{ num: 10, short: 'Oct', long: 'October' },
	{ num: 11, short: 'Nov', long: 'November' },
	{ num: 12, short: 'Dec', long: 'December' }
];

export const pad2 = (n) => `0${parseInt(n, 10) || 0}`.slice(-2);

export const monthLong = (m) => {
	const n = parseInt(m, 10);
	if (!n) return '';
	const found = MONTHS.find(x => x.num === n);
	return found ? found.long : '';
};

export const monthShort = (m) => {
	const n = parseInt(m, 10);
	if (!n) return '';
	const found = MONTHS.find(x => x.num === n);
	return found ? found.short : '';
};

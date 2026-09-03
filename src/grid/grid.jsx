import React from 'react';

import './grid.css';

function classes(...values) {
	return values.filter(Boolean).join(' ');
}

export function Container({children, className, fluid, ...props}) {
	return (
		<div
			className={classes('grid-container', fluid && 'grid-container-fluid', className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function Row({children, className, gutterWidth, ...props}) {
	return (
		<div
			className={classes('grid-row', gutterWidth === 0 && 'grid-row-no-gutter', className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function Col({children, className, offset, sm, xs, ...props}) {
	return (
		<div
			className={classes(
				'grid-col',
				xs && `grid-col-xs-${xs}`,
				sm && `grid-col-sm-${sm}`,
				offset?.xs && `grid-offset-xs-${offset.xs}`,
				offset?.sm && `grid-offset-sm-${offset.sm}`,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

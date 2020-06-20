/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/components';

/**
 * Block user interface icons
 */
const icons = {};

icons.shortcuts = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path d="m20 5h-16c-1.1 0-1.99.9-1.99 2l-.01 10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm-9 3h2v2h-2zm0 3h2v2h-2zm-3-3h2v2h-2zm0 3h2v2h-2zm-1 2h-2v-2h2zm0-3h-2v-2h2zm9 7h-8v-2h8zm0-4h-2v-2h2zm0-3h-2v-2h2zm3 3h-2v-2h2zm0-3h-2v-2h2z" />
		<Path d="m0 0h24v24h-24zm0 0h24v24h-24z" fill="none" />
	</SVG>
);

icons.back = (
	<SVG fill="none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
		<Path
			clipRule="evenodd"
			d="m6.25349 10.0667 2.55709-2.87673-1.12112-.99655-4.13649 4.65358 4.16672 4.1667 1.06066-1.0607-2.38634-2.3863h7.35799c.535 0 .8778.1787 1.1287.4378.2723.2812.479.7039.6218 1.2398.2599.9747.2542 2.0879.2504 2.8331-.0005.0848-.0009.1649-.0009.2394l1.5-.0002c0-.0662.0006-.1413.0012-.2242.0052-.7258.0146-2.0493-.3013-3.2345-.1779-.6673-.4753-1.3617-.9937-1.897-.5397-.5572-1.2741-.8942-2.2062-.8942z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</SVG>
);

icons.eye = (
	<SVG
		enableBackground="new 0 0 100 100"
		viewBox="0 0 100 100"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path d="m94.754 49.906c-15.175-15.134-30.421-22.802-45.33-22.802-.194 0-.39.001-.583.004-14.718.198-29.385 7.879-43.595 22.832l.063.061-.063.06c14.209 14.953 28.877 22.634 43.595 22.832.194.003.388.004.583.004 14.908 0 30.155-7.669 45.33-22.801l-.095-.095zm-45.865 19.397c-12.915-.174-25.912-6.667-38.672-19.302 12.76-12.636 25.758-19.13 38.672-19.304.178-.001.355-.003.533-.003 13.112 0 26.644 6.493 40.266 19.305-13.808 12.987-27.522 19.48-40.799 19.304z" />
		<Path d="m49.578 35.511c-7.973 0-14.458 6.486-14.458 14.459s6.486 14.458 14.458 14.458c7.973 0 14.458-6.485 14.458-14.458s-6.485-14.459-14.458-14.459zm0 25.327c-5.993 0-10.868-4.875-10.868-10.868s4.875-10.869 10.868-10.869 10.869 4.875 10.869 10.869-4.877 10.868-10.869 10.868z" />
	</SVG>
);

icons.eyeClosed = (
	<SVG
		enableBackground="new 0 0 100 100"
		viewBox="0 0 100 100"
		xmlns="http://www.w3.org/2000/svg"
	>
		<Path d="m92.678 48.738 2.178-2.178-9.147-9.147c.804-.752 1.607-1.528 2.411-2.33l-2.175-2.181c-12.581 12.547-25.091 18.858-37.18 18.664-11.77-.158-23.618-6.428-35.219-18.635l-2.232 2.123c.852.896 1.705 1.754 2.561 2.589l-8.729 8.73 2.18 2.178 8.79-8.792c2.091 1.904 4.191 3.623 6.3 5.164l-8.065 11.197 2.501 1.801 8.091-11.235c2.802 1.85 5.618 3.365 8.443 4.572l-4.83 12.635 2.877 1.1 4.823-12.616c3.429 1.196 6.868 1.928 10.313 2.174v12.548h3.081v-12.46c3.852-.046 7.729-.674 11.622-1.905l4.865 12.727 2.877-1.1-4.84-12.662c3.021-1.181 6.051-2.709 9.087-4.595l7.907 10.98 2.501-1.8-7.826-10.866c2.526-1.734 5.053-3.715 7.58-5.934z " />
	</SVG>
);

icons.caretDown = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M12.3 16.1l-5.8-5.6 1-1 4.7 4.4 4.3-4.4 1 1z" />
	</SVG>
);

icons.checkMark = (
	<SVG
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="components-iceberg-icon-checkmark"
	>
		<Path d="M4 12.5L9 17.5L19 7" stroke="currentColor" strokeWidth="1.5" />
	</SVG>
);

icons.paragraph = (
	<SVG fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<G stroke="currentColor" strokeWidth="1.5">
			<Path d="m14.9167 20v-15.11111" />
			<Path d="m10.4722 20v-15.11111" />
			<Path d="m18.3333 4.75h-8.88894" />
			<Path
				d="m9.13889 8.88889v4.07111c-1.9278-.3529-3.38889-2.0414-3.38889-4.07111 0-2.02975 1.46109-3.71824 3.38889-4.07111z"
				fill="currentColor"
			/>
		</G>
	</SVG>
);

icons.typography = (
	<SVG fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path
			clipRule="evenodd"
			d="m2.5 7.5v-3h13v3h-5v12h-3v-12zm10 2h9v3h-3v7h-3v-7h-3z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</SVG>
);

icons.color = (
	<SVG
		fill="none"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		className="components-iceberg-icon-color"
	>
		<Path
			d="m17.4405 13.9048c0 2.9521-2.3932 5.3452-5.3453 5.3452-2.95206 0-5.3452-2.3931-5.3452-5.3452 0-.6516.30742-1.5564.86616-2.6187.54649-1.0389 1.28372-2.13747 2.03395-3.14942.74819-1.0092 1.49809-1.91729 2.06179-2.57389.1405-.16369.2693-.31151.3833-.44112.1141.12961.2428.27743.3834.44112.5637.6566 1.3136 1.56469 2.0618 2.57389.7502 1.01195 1.4874 2.11052 2.0339 3.14942.5588 1.0623.8662 1.9671.8662 2.6187z"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
	</SVG>
);

icons.ellipsis = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z" />
	</SVG>
);

icons.externalLink = (
	<SVG fill="none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
		<Path
			clipRule="evenodd"
			d="m14.5542 10.0668-2.5571-2.87677 1.1211-.99655 4.1365 4.65352-4.1667 4.1667-1.0607-1.0606 2.3864-2.3863h-7.35807c-.53491 0-.87772.1786-1.12867.4377-.27232.2812-.47894.7039-.6218 1.2398-.25983.9747-.25416 2.088-.25036 2.8331.00043.0849.00084.1649.00083.2395l-1.5-.0003c.00001-.0662-.00053-.1413-.00112-.2242-.0052-.7257-.01468-2.0493.30127-3.2345.17787-.6672.47534-1.3617.99367-1.8969.5397-.5573 1.27411-.8942 2.20618-.8942z"
			fill="currentColor"
			fillRule="evenodd"
		/>
	</SVG>
);

icons.link = (
	<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z"></path></svg>
);

export default icons;

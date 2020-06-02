/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { Fragment, Component, render } from '@wordpress/element';
import { withSpokenMessages, Button, SVG, Path } from '@wordpress/components';

class ShortcutButton extends Component {
	constructor() {
		super( ...arguments );
		this.addPinnedButton = this.addPinnedButton.bind( this );
	}

	componentDidMount() {
		this.addPinnedButton();
	}

	componentDidUpdate() {
		this.addPinnedButton();
	}

	addPinnedButton() {
		const { isActive, onToggle } = this.props;

		const icon = (
			<SVG
				fill="none"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					clipRule="evenodd"
					d="m8.14003 3h3.15457c-2.00451 2.0977-.9186 4.00235.1611 5.89622.6354 1.11458 1.2687 2.22538 1.2687 3.36968 0 1.6928-.438 2.7871-1.1827 3.4936h.2451c.6674 0 1.2132.5422 1.2132 1.2405h-7v-11.76074c0-1.23153.9629-2.23926 2.14003-2.23926zm-.23846 7.969v-2.21176c0-.81235-1.15748-.81138-1.15748.00097v3.44009c.64572 0 1.15748-.5534 1.15748-1.2293zm4.18903 1.2293c0 2.7272-1.1329 3.5543-3.03154 4.0786v-8.09921h1.35034c.1689.32009.3414.62743.5085.92514.624 1.11177 1.1727 2.08927 1.1727 3.09547zm-4.21659-7.83648c.31909-.33619.83813-.3369 1.15748-.00097 0-.81236-1.15748-.81139-1.15748.00097z"
					fill="currentColor"
					fillRule="evenodd"
				/>
			</SVG>
		);

		const ShortcutPinnedButton = () => {
			return (
				<Fragment>
					<Button
						icon={ icon }
						onClick={ () => {
							onToggle();
						} }
					></Button>
				</Fragment>
			);
		};

		const moreMenuButton = document.querySelector( '.edit-post-more-menu' );

		if (
			! isActive &&
			! document.getElementById(
				'components-iceberg-shortcut-pinned-button'
			)
		) {
			moreMenuButton.insertAdjacentHTML(
				'beforebegin',
				'<div id="components-iceberg-shortcut-pinned-button"></div>'
			);

			render(
				<ShortcutPinnedButton />,
				document.getElementById(
					'components-iceberg-shortcut-pinned-button'
				)
			);
		} else if ( isActive ) {
			document
				.getElementById( 'components-iceberg-shortcut-pinned-button' )
				.remove();
		}
	}

	render() {
		return false;
	}
}

export default compose( [ withSpokenMessages ] )( ShortcutButton );
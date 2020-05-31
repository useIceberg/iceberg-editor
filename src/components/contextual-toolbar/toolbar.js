/**
 * WordPress dependencies
 */
import { Component, Fragment, createRef } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	withSpokenMessages,
	Popover,
	Toolbar,
	Slot,
} from '@wordpress/components';

class ContextualToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectionChange = this.onSelectionChange.bind( this );
		this.onSelectionStart = this.onSelectionStart.bind( this );
		this.onSelectionEnd = this.onSelectionEnd.bind( this );
		this.containerRef = createRef();

		this.state = {
			anchorRef: null,
			isVisible: false,
			isSelecting: false,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.onSelectionChange );
		document.addEventListener( 'selectstart', this.onSelectionStart );
		document.addEventListener( 'mouseup', this.onSelectionEnd );
	}

	onSelectionStart() {
		this.setState( { isSelecting: true } );
	}

	onSelectionEnd() {
		const { isSelecting } = this.state;

		if ( isSelecting ) {
			setTimeout(
				function() {
					this.setState( { isSelecting: false, isVisible: true } );
				}.bind( this ),
				150
			);
		}
	}

	onSelectionChange() {
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( selection.isCollapsed ) {
			this.setState( { isVisible: false, anchorRef: null } );
			return;
		}

		if (
			range.startContainer.parentNode.classList.contains( 'wp-block' ) ||
			range.startContainer.parentNode.classList.contains( 'rich-text' ) ||
			range.startContainer.parentNode.hasAttribute(
				'data-rich-text-format-boundary'
			)
		) {
			this.setState( { anchorRef: range } );
		}

		return false;
	}

	render() {
		const { isActive } = this.props;
		const { anchorRef, isVisible } = this.state;

		if ( ! isActive ) {
			return false;
		}

		if ( anchorRef && isVisible ) {
			return (
				<Fragment>
					<Popover
						ref={ this.containerRef }
						className="component-iceberg-contextual-toolbar"
						position="top center"
						focusOnMount={ false }
						anchorRef={ anchorRef }
						onFocusOutside={ ( event ) => {
							const containerElement = document.querySelector(
								'.component-iceberg-contextual-toolbar'
							);
							if (
								containerElement &&
								! containerElement.contains( event.target )
							) {
								this.setState( {
									isVisible: false,
								} );
							}
						} }
					>
						<Toolbar>
							{ [ 'bold', 'italic', 'link' ].map( ( format ) => (
								<Slot
									name={ `RichText.ToolbarControls.${ format }` }
									key={ format }
								/>
							) ) }
						</Toolbar>
					</Popover>
				</Fragment>
			);
		}

		return false;
	}
}

export default compose( [
	withInstanceId,
	withSelect( ( select ) => ( {
		isActive: select( 'core/edit-post' ).isFeatureActive(
			'icebergWritingMode'
		),
	} ) ),
	withSpokenMessages,
] )( ContextualToolbar );

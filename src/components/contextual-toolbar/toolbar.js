/**
 * WordPress dependencies
 */
import { Component, Fragment, createRef } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { ESCAPE } from '@wordpress/keycodes';
import { compose, withInstanceId } from '@wordpress/compose';
import { switchToBlockType } from '@wordpress/blocks';
import {
	withSpokenMessages,
	Popover,
	Toolbar,
	Slot,
	SVG,
	Path,
	Button,
} from '@wordpress/components';

class ContextualToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectionChange = this.onSelectionChange.bind( this );
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
		document.addEventListener( 'mouseup', this.onSelectionEnd );
		document.addEventListener( 'keyup', this.onSelectionEnd );
	}

	onSelectionEnd( event ) {
		const { isSelecting, isVisible } = this.state;
		const { keyCode } = event;

		if ( ( ESCAPE === keyCode || event.shiftKey ) && isVisible ) {
			this.setState( { isVisible: false } );
		}

		if ( isSelecting && ! event.shiftKey ) {
			setTimeout(
				function() {
					this.setState( { isSelecting: false, isVisible: true } );
				}.bind( this ),
				150
			);
		}
	}

	onSelectionChange() {
		const { isSelecting } = this.state;
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( ! isSelecting && range.startOffset !== range.endOffset ) {
			this.setState( { isSelecting: true } );
		}

		if ( selection.isCollapsed ) {
			this.setState( { isVisible: false, anchorRef: null } );
			return;
		}

		if (
			range.startContainer.parentNode.classList.contains( 'wp-block' ) ||
			range.startContainer.parentNode.classList.contains( 'rich-text' ) ||
			range.startContainer.parentNode.parentNode.classList.contains(
				'wp-block'
			) ||
			range.startContainer.parentNode.parentNode.classList.contains(
				'rich-text'
			) ||
			range.startContainer.parentNode.hasAttribute(
				'data-rich-text-format-boundary'
			)
		) {
			this.setState( { anchorRef: range } );
		}

		return false;
	}

	render() {
		const { isActive, clientId, onTransform, name } = this.props;
		const { anchorRef, isVisible } = this.state;

		if ( ! isActive ) {
			return false;
		}

		const titleIcon = (
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 0 24 24"
				width="24"
			>
				<Path d="M0 0h24v24H0V0z" fill="none" />
				<Path d="M5 4v3h5.5v12h3V7H19V4z" />
			</SVG>
		);

		if ( anchorRef && isVisible && ! [ 'core/code' ].includes( name ) ) {
			return (
				<Fragment>
					<Popover
						ref={ this.containerRef }
						className="component-iceberg-contextual-toolbar"
						position="top center"
						focusOnMount="container"
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
							{ [
								'core/heading',
								'core/paragraph',
								'core/quote',
							].includes( name ) && (
								<Fragment>
									<Button
										isPressed={ name === 'core/heading' }
										icon={ titleIcon }
										onClick={ () => {
											onTransform(
												clientId,
												this.props,
												name === 'core/heading'
													? 'core/paragraph'
													: 'core/heading'
											);
										} }
									></Button>

									<Button
										isPressed={ name === 'core/quote' }
										icon="editor-quote"
										onClick={ () => {
											onTransform(
												clientId,
												this.props,
												name === 'core/quote'
													? 'core/paragraph'
													: 'core/quote'
											);
										} }
									></Button>
								</Fragment>
							) }
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
	withDispatch( ( dispatch ) => ( {
		onTransform( clientId, blocks, name ) {
			dispatch( 'core/block-editor' ).replaceBlocks(
				clientId,
				switchToBlockType( blocks, name )
			);
		},
	} ) ),
	withSpokenMessages,
] )( ContextualToolbar );
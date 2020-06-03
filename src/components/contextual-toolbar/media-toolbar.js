/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { getRectangleFromRange } from '@wordpress/dom';
import { compose, withInstanceId } from '@wordpress/compose';
import { BlockAlignmentToolbar } from '@wordpress/block-editor';
import { withSpokenMessages, Popover, Toolbar } from '@wordpress/components';

class MediaToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.updateAlignment = this.updateAlignment.bind( this );
		this.syncPosition = this.syncPosition.bind( this );

		this.state = {
			anchorRef: null,
			isUpdated: false,
		};
	}

	componentDidMount() {
		this.syncPosition();
	}

	componentDidUpdate() {
		this.syncPosition();
	}

	syncPosition() {
		const { clientId } = this.props;
		const { isUpdated } = this.state;
		const range = document.createRange();
		const elementRect = document.querySelector(
			'[data-block="' + clientId + '"]'
		);
		range.selectNodeContents( elementRect );

		if ( ! isUpdated ) {
			this.setState( { anchorRef: range, isUpdated: true } );
		}
	}

	updateAlignment( nextAlign ) {
		const extraUpdatedAttributes =
			[ 'wide', 'full' ].indexOf( nextAlign ) !== -1
				? { width: undefined, height: undefined }
				: {};
		this.props.setAttributes( {
			...extraUpdatedAttributes,
			align: nextAlign,
		} );

		this.setState( { isUpdated: false } );
	}

	render() {
		const { isActive, attributes } = this.props;
		const { align } = attributes;
		const { anchorRef } = this.state;

		if ( ! isActive ) {
			return false;
		}

		return (
			<Fragment>
				<Popover
					className="component-iceberg-contextual-toolbar"
					position="top center"
					focusOnMount="container"
					anchorRef={ anchorRef }
				>
					<Toolbar>
						<BlockAlignmentToolbar
							isCollapsed={ false }
							value={ align }
							onChange={ this.updateAlignment }
						/>
					</Toolbar>
				</Popover>
			</Fragment>
		);
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
		updateBlockAttributes: dispatch( 'core/block-editor' )
			.updateBlockAttributes,
	} ) ),
	withSpokenMessages,
] )( MediaToolbar );

/**
 * WordPress dependencies
 */
import { ClipboardButton } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { withState, compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import icons from '../icons';

function CreateHTMLAnchorMenuItem( {
	clientId,
	updateBlockAttributes,
	anchor,
	permalink,
	hasCopied,
	setState,
} ) {
	if ( typeof anchor === 'undefined' ) {
		anchor =
			'h' +
			Math.random()
				.toString( 36 )
				.substring( 2, 6 ) +
			Math.random()
				.toString( 36 )
				.substring( 2, 4 );
	}

	const link = permalink + '#' + anchor;

	return (
		<ClipboardButton
			text={ link }
			role="menuitem"
			className="components-menu-item__button"
			onCopy={ () => {
				setState( { hasCopied: true } );
				updateBlockAttributes( clientId, {
					anchor,
				} );
			} }
			onFinishCopy={ () => setState( { hasCopied: false } ) }
		>
			{ hasCopied
				? __( 'Copied to clipboard!' )
				: __( 'Create HTML anchor', 'iceberg' )
			}
			{ hasCopied
				? icons.checkMark
				: icons.link
			}
		</ClipboardButton>
	);
}

export default compose(
	withSelect( ( select ) => ( {
		permalink: select( 'core/editor' ).getPermalink(),
	} ) ),
	withState( { hasCopied: false } )
)( CreateHTMLAnchorMenuItem );

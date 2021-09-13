/**
 * WordPress dependencies
 */
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CheckboxUIControl from './checkbox-ui';

function BaseOption( { label, isChecked, onChange, children, optionType } ) {
	const [ isOptionChecked, setIsOptionChecked ] = useState( isChecked );

	return (
		<div className="edit-post-options-modal__option">
			{ optionType === 'ui' ? (
				<CheckboxUIControl
					label={ label }
					checked={ isOptionChecked }
					onChange={ ( e ) => {
						setIsOptionChecked( ! isOptionChecked );
						onChange( e );
					} }
				/>
			) : (
				<CheckboxControl
					label={ label }
					checked={ isOptionChecked }
					onChange={ ( e ) => {
						setIsOptionChecked( ! isOptionChecked );
						onChange( e );
					} }
				/>
			) }
			{ children }
		</div>
	);
}

export default BaseOption;

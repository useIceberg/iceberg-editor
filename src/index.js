/**
 * Internal dependencies
 */
import './components/markdown';
import './components/editor';
import './components/table-of-contents';
import './components/heading-level-indicator';
import './components/options-modal/licenses/license-activation';
import './components/block-indicator';
import './components/contextual-toolbar';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

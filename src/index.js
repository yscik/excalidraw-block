import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

import edit from './edit';
import save from './save';
import block from './block.json';
import icon from './icon.js';
import transforms from './transforms';

registerBlockType( block.name, {
	icon,
	edit,
	save,
	transforms,
	...block,
} );

// TODO DO NOT COMMIT
window.addEventListener( 'beforeunload', function ( event ) {
	event.stopImmediatePropagation();
} );

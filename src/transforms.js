import { createBlock } from '@wordpress/blocks';
import block from './block.json';

export default {
	from: [
		{
			type: 'raw',
			isMatch: ( node ) =>
				node.nodeName === 'P' &&
				/^{"type":"excalidraw\/clipboard"/i.test( node.textContent ),
			transform: ( node ) => {
				try {
					const { elements, files } = JSON.parse( node.textContent );

					return createBlock( block.name, {
						scene: { elements },
						files: Object.values( files || {} ),
					} );
				} catch ( err ) {
					return createBlock( 'core/paragraph', {
						content: node.textContent,
					} );
				}
			},
		},
	],
};

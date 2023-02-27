import { useBlockProps } from '@wordpress/block-editor';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw';

import './editor.scss';

/**
 * Load scene data from the initial attribute values.
 *
 * @param {Object} attributes Block attributes.
 */
function useInitialAttributes( attributes ) {
	return useMemo( () => {
		const files = attributes.files?.reduce( ( m, file ) => {
			file.id = file.id.replace( /^image-/, '' );
			m[ file.id ] = file;
			return m;
		}, {} );
		return { elements: attributes.scene?.elements, files };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ! attributes.scene ] );
}

/**
 * Save scene data to the block attributes, and generate SVG output.
 *
 * @param {Function} setAttributes Block attributes setter.
 */
function useSaveOnChange( setAttributes ) {
	const [ savedElementsHash, setSavedElementsHash ] = useState( null );

	return useCallback(
		async ( elements, appState, files ) => {
			const isIdle =
				! appState.editingElement &&
				! appState.draggingElement &&
				! appState.resizingElement &&
				! appState.isResizing &&
				! appState.isRotating &&
				! appState.isLoading;

			if ( ! isIdle ) {
				return;
			}

			const elementsHash = JSON.stringify( elements );

			if ( elementsHash !== savedElementsHash ) {
				setSavedElementsHash( elementsHash );

				const svg = await exportToSvg( { elements, appState, files } );
				setAttributes( { scene: { elements }, svg: svg.outerHTML } );
			}
		},
		[ savedElementsHash, setAttributes ]
	);
}

/**
 * Refresh on every re-render. (Re-calculate container position, since the block can often move around.)
 *
 * @param {Object} excalidrawRef
 */
function useRefreshContainerPosition( excalidrawRef ) {
	useEffect( () => {
		if (
			excalidrawRef.current &&
			! excalidrawRef.current.appState?.isLoading
		) {
			excalidrawRef.current.refresh();
		}
	} );
}

/**
 * Block editor component. Embeds and integrates Excalidraw editor.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Block attribute setter.
   @param {boolean}  props.isSelected    Block selected state.
 */
export default function Edit( { attributes, setAttributes, isSelected } ) {
	const excalidrawRef = useRef( null );

	useRefreshContainerPosition( excalidrawRef );

	const initialData = useInitialAttributes( attributes );

	const onChange = useSaveOnChange( setAttributes );

	return (
		<div
			{ ...useBlockProps( {
				className: 'excalidraw-wrapper',
			} ) }
			onWheelCapture={ ( e ) => ! isSelected && e.stopPropagation() }
		>
			<Excalidraw
				ref={ excalidrawRef }
				initialData={ initialData }
				onChange={ onChange }
			/>
		</div>
	);
}

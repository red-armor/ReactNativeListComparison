import { Dimension, ListGroupDimensions } from '@infinite-list/data-model';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ViewabilityContext } from '../../../../container/ScrollView';

export default (props) => {
  const disposerRef = useRef<Function>();
  const initialRef = useRef(true);
  const dimensionsRef = useRef<Dimension>();
  const viewabilityContextValue = useContext(ViewabilityContext);
  const { itemKey, ignoredToPerBatch } = props;
  const dimensions = useMemo(
    () => viewabilityContextValue.dimensions as ListGroupDimensions,
    []
  );

  const onRender = useCallback(() => {
    setRequireRender(() => true);
  }, []);

  if (initialRef.current) {
    const { remover, dimensions: itemDimensions } = dimensions.registerItem(
      itemKey,
      ignoredToPerBatch,
      onRender
    );
    disposerRef.current = remover;
    dimensionsRef.current = itemDimensions;

    initialRef.current = false;
  }

  const [requireRender, setRequireRender] = useState(
    dimensionsRef.current!.getRequireRendered()
  );

  useEffect(
    () => () => {
      if (typeof disposerRef.current === 'function') disposerRef.current();
    },
    []
  );

  return requireRender;
};

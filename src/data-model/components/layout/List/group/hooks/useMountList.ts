import {
  ListGroupDimensions,
  defaultKeyExtractor,
} from '@infinite-list/data-model';
import { useContext, useEffect, useMemo, useRef } from 'react';

import { ViewabilityContext } from '../../../../container/ScrollView';

export default (props) => {
  const disposerRef = useRef<Function>();
  const initialRef = useRef(true);

  const viewabilityContextValue = useContext(ViewabilityContext);
  const {
    data,
    groupId,
    keyExtractor = defaultKeyExtractor,
    id,
    onEndReached,
    ...rest
  } = props;

  const dimensions = useMemo(
    () => viewabilityContextValue.dimensions as ListGroupDimensions,
    []
  );

  useEffect(() => {
    dimensions.setOnEndReached(id, onEndReached);
  }, [onEndReached]);

  if (initialRef.current) {
    disposerRef.current = dimensions.registerList(id, {
      data,
      keyExtractor,
      onEndReached,
      ...rest,
    }).remover;
    initialRef.current = false;
  }

  useEffect(
    () => () => {
      if (typeof disposerRef.current === 'function') disposerRef.current();
    },
    []
  );
};

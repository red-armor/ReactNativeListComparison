import { defaultKeyExtractor } from '@infinite-list/data-model';
import React, { useContext, useEffect, useMemo, useRef } from 'react';

import {
  ScrollViewContext,
  defaultViewabilityConfigCallbackPairs,
} from '../../container/ScrollView';
import ContextContent from './ContextContent';
import Footer from './Footer';
import Header from './Header';
import { DefaultItemT, ListProps } from './types';

let count = 0;

const List = <ItemT extends DefaultItemT>(props: ListProps<ItemT>) => {
  const scrollViewContextValue = useContext(ScrollViewContext);
  const {
    id,
    ListFooterComponent,
    ListFooterComponentStyle,
    ListHeaderComponent,
    ListHeaderComponentStyle,
    viewabilityConfig,
    onViewableItemsChanged,
    keyExtractor = defaultKeyExtractor,
    viewabilityConfigCallbackPairs = defaultViewabilityConfigCallbackPairs,
    teleportItemProps,
    renderItem,
    ...rest
  } = props;
  const { marshal } = scrollViewContextValue;
  const listKey = useMemo(() => id || `list_${count++}`, []);

  if (!marshal) {
    console.error(
      '[Spectrum Error]: `List` should be wrapped by Spectrum `ScrollView`'
    );
  }

  const renderItemRef = useRef(renderItem);
  useEffect(() => {
    if (renderItemRef.current !== renderItem) {

      renderItemRef.current = renderItem;
      console.warn("[Spectrum warn]: `renderItem` props shouldn't be changed.");
    }
  }, [renderItem]);

  return (
    <React.Fragment>
      <Header
        ListHeaderComponent={ListHeaderComponent}
        ListHeaderComponentStyle={ListHeaderComponentStyle}
      />

      <ContextContent
        {...rest}
        listKey={listKey}
        keyExtractor={keyExtractor}
        teleportItemProps={teleportItemProps}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        renderItem={renderItemRef.current}
      />

      <Footer
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={ListFooterComponentStyle}
      />
    </React.Fragment>
  );
};

export default React.memo(List);

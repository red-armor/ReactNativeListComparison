import { ListDimensions } from '@infinite-list/data-model';
import React, { useCallback } from 'react';

import { StickyItem as ScrollViewStickyItem } from '../../../container/ScrollView';
import { DefaultItemT, ListStickyItemProps } from '../types';
import MemoedItem from './MemoedItem';

const StickyItem = <ItemT extends DefaultItemT>(
  props: ListStickyItemProps<ItemT>
) => {
  const {
    item,
    itemKey,
    listKey,
    renderItem,
    dimensions,
    teleportItemProps,
    measureLayoutHandler,
    CellRendererComponent,
    viewableItemHelperKey,
  } = props;

  const getMetaOnViewableItemsChanged = useCallback(() => {
    return {
      item,
      index:
        dimensions instanceof ListDimensions
          ? dimensions.getKeyIndex(itemKey)
          : dimensions.getKeyIndex(itemKey, listKey),
    };
  }, [item]);

  return (
    <ScrollViewStickyItem
      isIntervalTreeItem
      ownerId={listKey}
      item={item}
      CellRendererComponent={CellRendererComponent}
      onMeasureLayout={measureLayoutHandler}
      viewableItemHelperKey={viewableItemHelperKey}
      getMetaOnViewableItemsChanged={getMetaOnViewableItemsChanged}
    >
      <MemoedItem
        item={item}
        itemKey={itemKey}
        listKey={listKey}
        renderItem={renderItem}
        dimensions={dimensions}
        teleportItemProps={teleportItemProps}
      />
    </ScrollViewStickyItem>
  );
};

export default StickyItem;

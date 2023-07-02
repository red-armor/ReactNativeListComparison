import { ListDimensions } from '@infinite-list/data-model';
import React, { useCallback, useEffect } from 'react';

import { ViewableItem as ScrollViewViewableItem } from '../../../container/ScrollView';
import { DefaultItemT, ListViewableItemProps } from '../types';
import MemoedItem from './MemoedItem';

const ViewableItem = <ItemT extends DefaultItemT>(
  props: ListViewableItemProps<ItemT>
) => {
  const {
    item,
    itemKey,
    listKey,
    dimensions,
    containerKey,
    renderItem: RenderedItem,
    teleportItemProps,
    measureLayoutHandler,
    CellRendererComponent,
    viewableItemHelperKey,
    viewAbilityPropsSensitive = true,
    ...rest
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
    <ScrollViewViewableItem
      item={item}
      ownerId={listKey}
      isIntervalTreeItem
      containerKey={containerKey}
      onMeasureLayout={measureLayoutHandler}
      viewableItemHelperKey={viewableItemHelperKey}
      CellRendererComponent={CellRendererComponent}
      getMetaOnViewableItemsChanged={getMetaOnViewableItemsChanged}
      viewAbilityPropsSensitive={viewAbilityPropsSensitive}
      {...rest}
    >
      <RenderedItem
        item={item}
        listKey={listKey}
        itemKey={itemKey}
        // renderItem={renderItem}
        teleportItemProps={teleportItemProps}
        dimensions={dimensions}
      />
      {/* <Item renderItem={renderItem} item={item} index={index} /> */}
      {/* {renderItem({ item, index })} */}
    </ScrollViewViewableItem>
  );
};

export default ViewableItem;

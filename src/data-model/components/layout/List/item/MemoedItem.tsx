import { ListDimensions, ListGroupDimensions } from '@infinite-list/data-model';
import React, { PropsWithChildren, memo, useEffect, useRef } from 'react';

import { TeleportItemProps } from '../types';

export default memo(
  (
    props: PropsWithChildren<{
      renderItem: any;
      item: any;
      itemKey: string;
      listKey: string;
      teleportItemProps: TeleportItemProps;
      dimensions: ListDimensions | ListGroupDimensions;
    }>
  ) => {
    const {
      item,
      itemKey,
      listKey,
      dimensions,
      renderItem: RenderItem,
      teleportItemProps,
      ...rest
    } = props;

    // const initialRef = useRef(true)

    // useEffect(() => {
    //   if (initialRef.current) {
    //     console.log('List - MemoedItem : mount item', itemKey, rest.itemMeta.getIndexInfo().index, rest.itemMeta.getState().viewable)
    //   }

    //   initialRef.current = false

    //   return () => {
    //     console.log('List - MemoedItem : unmount item', itemKey, rest.itemMeta.getIndexInfo().index, rest.itemMeta.getState().viewable)
    //   }
    // }, [])

    // useEffect(() => {
    //   if (!initialRef.current) {
    //     console.log('List - MemoedItem : update item', itemKey, rest.itemMeta.getIndexInfo().index, rest.itemMeta.getState().viewable)
    //   }
    // }, [itemKey])

    const index =
      dimensions instanceof ListDimensions
        ? dimensions.getKeyIndex(itemKey)
        : dimensions.getKeyIndex(itemKey, listKey);
    const teleportProps =
      typeof teleportItemProps === 'function'
        ? teleportItemProps({ item, index })
        : {};

    return (
      <RenderItem item={item} {...teleportProps} itemKey={itemKey} {...rest} />
    );
  }
);

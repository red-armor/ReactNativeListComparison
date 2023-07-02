import React, { memo, useMemo } from 'react';
import { DefaultItemT, ItemProps } from '../types';
import StickyItem from './StickyItem';
import ViewableItem from './ViewableItem';

const ListItem = <ItemT extends DefaultItemT>(props: ItemProps<ItemT>) => {
  const {
    item,
    itemKey,
    isHeadItem,
    isStickyItem,
    onMeasureLayout,

    renderItem: RenderedItem,
    CellRendererComponent,
    ItemSeparatorComponent,
    viewAbilityPropsSensitive,
    ...rest
  } = props;

  const _onMeasureItemLayout = useMemo(() => {
    if (typeof onMeasureLayout === 'function') {
      return (x, y, width, height) => {
        if (typeof onMeasureLayout === 'function') {
          onMeasureLayout({
            x,
            y,
            width,
            height,
            item,
            itemKey,
          });
        }
      };
    }

    return null;
  }, [itemKey]);

  return (
    <>
      {!isHeadItem && ItemSeparatorComponent && <ItemSeparatorComponent />}

      <RenderedItem
        item={item}
        // listKey={listKey}
        itemKey={itemKey}
        // renderItem={renderItem}
        // teleportItemProps={teleportItemProps}
        // dimensions={dimensions}
      />
      {/* {React.createElement(isStickyItem ? StickyItem : ViewableItem, {
        item,
        itemKey,
        isListItem: true,
        measureLayoutHandler: _onMeasureItemLayout,
        CellRendererComponent,
        viewableItemHelperKey: itemKey,
        viewAbilityPropsSensitive,
        ...rest,
      })} */}
    </>
  );
};

export default memo(ListItem);

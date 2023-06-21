import { ListDimensions } from '@infinite-list/data-model';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { ViewabilityContext } from '../../container/ScrollView';
import Item from './item';
import { ContentProps, DefaultItemT } from './types';

/**
 *
 * @param props
 * @returns
 *
 * intervalTree先行，因为这个是一个静态的东西；至于viewableItemHelper的话后续会进行
 * 值的补充
 */
const Content = <ItemT extends DefaultItemT>(props: ContentProps<ItemT>) => {
  const {
    listKey,
    renderItem,
    teleportItemProps,
    ItemSeparatorComponent,
    onMeasureItemLayout,
    CellRendererComponent,
    WrapperComponent = React.Fragment,
    viewAbilityPropsSensitive = true,
  } = props;
  const viewabilityContextValue = useContext(ViewabilityContext);

  const dimensions = viewabilityContextValue.dimensions as ListDimensions;

  const [state, setState] = useState<any>(dimensions.stateResult);

  useEffect(
    () =>
      dimensions.addStateListener(newState => {
        setState(newState);
      }),
    []
  );

  const _onMeasureItemLayout = useMemo(() => {
    if (typeof onMeasureItemLayout === 'function') {
      return ({ height, itemKey, width, x, y }) => {
        if (typeof onMeasureItemLayout === 'function') {
          onMeasureItemLayout({
            x,
            y,
            width,
            height,
            key: itemKey,
          });
        }
      };
    }

    return null;
  }, []);


  // console.log('state recycle ', state.recycleState.map(({
  //   key, itemMeta, length, 
  // }) => ({
  //   key,
  //   length,
  //   index: itemMeta.getIndexInfo().index,
  //   viewable: itemMeta.getState().viewable,
  // })))

  return (
    // if container has style, then absolute item should be wrapped in View Component
    <WrapperComponent>
      {state.spaceState.map((stateResult, index) => {
        const { isSpace, key, item, length, isSticky } = stateResult;
        return isSpace ? (
          <View key={key} style={{ height: length }} />
        ) : (
          <Item
            item={item}
            key={key}
            itemKey={key}
            listKey={listKey}
            ownerId={listKey}
            isHeadItem={!index}
            renderItem={renderItem}
            isStickyItem={isSticky}
            dimensions={dimensions}
            onMeasureLayout={_onMeasureItemLayout}
            teleportItemProps={teleportItemProps}
            viewAbilityPropsSensitive={viewAbilityPropsSensitive}
            ItemSeparatorComponent={ItemSeparatorComponent}
            CellRendererComponent={CellRendererComponent}
          />
        );
      })}
      {state.recycleState.map((stateResult, index) => {
        const { key, item, isSticky, offset, targetKey } = stateResult;
        // console.log('key ', key)
        return (
          <View
            key={key}
            style={{
              position: 'absolute',
              top: !offset ? -4000 : offset,
              left: 0,
              right: 0,
            }}
          >
            <Item
              item={item}
              key={key}
              itemKey={targetKey}
              listKey={listKey}
              ownerId={listKey}
              isHeadItem={!index}
              containerKey={key}
              renderItem={renderItem}
              isStickyItem={isSticky}
              dimensions={dimensions}
              onMeasureLayout={_onMeasureItemLayout}
              teleportItemProps={teleportItemProps}
              viewAbilityPropsSensitive={viewAbilityPropsSensitive}
              ItemSeparatorComponent={ItemSeparatorComponent}
              CellRendererComponent={CellRendererComponent}
            />
          </View>
        );
      })}
    </WrapperComponent>
  );
};

export default React.memo(Content);

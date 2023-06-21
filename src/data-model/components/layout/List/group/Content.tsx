import { ListGroupDimensions } from '@infinite-list/data-model';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { ViewabilityContext } from '../../../container/ScrollView';
import Item from '../item';
import { ContentProps, DefaultItemT } from '../types';

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
    CellRendererComponent,
    viewAbilityPropsSensitive,
  } = props;
  const viewabilityContextValue = useContext(ViewabilityContext);
  const ownerId = listKey;
  const dimensions = viewabilityContextValue.dimensions as ListGroupDimensions;

  const [state, setState] = useState<any>(dimensions.getState(ownerId));

  useEffect(
    () =>
      dimensions.addStateListener(ownerId, newState => {
        setState(newState);
      }),
    []
  );

  if (!state?.length) return null;

  return (
    <>
      {state.map((stateResult, index) => {
        const { isSpace, key, item, length } = stateResult;

        return isSpace ? (
          <View style={{ height: length }} />
        ) : (
          <Item
            item={item}
            key={key}
            itemKey={key}
            listKey={listKey}
            ownerId={listKey}
            isHeadItem={!index}
            renderItem={renderItem}
            dimensions={dimensions}
            teleportItemProps={teleportItemProps}
            viewAbilityPropsSensitive={viewAbilityPropsSensitive}
            ItemSeparatorComponent={ItemSeparatorComponent}
            CellRendererComponent={CellRendererComponent}
          />
        );
      })}
    </>
  );
};

export default Content;

import { ListDimensions } from '@infinite-list/data-model';
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
    teleportItemProps,

    renderItem,
    ItemSeparatorComponent,

    onMeasureItemLayout,

    CellRendererComponent,
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

  // 为什么要有这个属性；因为List如果支持了`releaseOnDemand`的话，列表特别长，这个时候
  // 滚动会释放掉`windowSize`以外的item；但是当你比如滑动到底，然后快速滑动到顶部的时候，
  // _updateCellsToRenderBatcher是一个一次batch最多maxToRenderPerBatch个加到`state`；
  // 如果没有`measureLayoutHandlerOnDemand`这种一直触动update的方式，单纯的依靠
  // `onScroll` / `onMomentumScrollEnd`会出现顶部不渲染的问题；因为`next batch`没有办法
  // 触发；
  // const measureLayoutHandlerOnDemand = useCallback(() => {
  //   _updateCellsToRenderBatcher.schedule();
  // }, []);

  if (!state?.length) return null;

  return (
    <>
      {state.map((stateResult, index) => {
        const { isSpace, key, item, length, isSticky } = stateResult;

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
    </>
  );
};

export default React.memo(Content);

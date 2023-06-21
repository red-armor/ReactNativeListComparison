import { ListGroupDimensions } from '@infinite-list/data-model';
import React, { useCallback, useContext, useMemo, useRef } from 'react';

import {
  ViewabilityContext,
  ViewableItem,
} from '../../../container/ScrollView';
import { INTERVAL_TREE_INITIAL_SIZE } from '../constants';
import Content from './Content';

const ContextContent = (props) => {
  const viewabilityContextValue = useContext(ViewabilityContext);
  const dimensions = viewabilityContextValue.dimensions as ListGroupDimensions;
  const {
    listKey,
    data: listData,
    contentContainerStyle = {},
    getItemLayout,
    keyExtractor,
    viewabilityConfig,
    onViewableItemsChanged,
    getItemSeparatorLength,
    viewabilityConfigCallbackPairs,
    onUpdateIntervalTree,
    onUpdateItemLayout,
    initialSize = INTERVAL_TREE_INITIAL_SIZE,
    onMeasureLayout: _onMeasureLayout,
    ...rest
  } = props;
  const contentRef = useRef();
  const viewableItemHelperKey = useMemo(() => `${listKey}_context_content`, []);
  const dataRef = useRef(listData);

  const onMeasureLayout = useMemo(() => {
    if (typeof _onMeasureLayout === 'function') {
      return (x, y, w, h) => {
        _onMeasureLayout(x, y, w, h);
      };
    }
    return null;
  }, [listKey]);

  const measureLayoutHandlerRef = useRef<Function>();
  const setMeasureLayoutHandler = useCallback((handler) => {
    measureLayoutHandlerRef.current = handler;
  }, []);

  if (dataRef.current !== listData) {
    dimensions.setListData(listKey, listData);
    dataRef.current = listData;
  }

  return (
    <ViewableItem
      ownerId={listKey}
      // @ts-ignore
      ref={contentRef}
      // TODO：getContainerOffset会涉及到从`general`中拿对应的值；但是在`useViewable`
      // 已经将非ListItem的数据放置到了顶层；但是，目前考虑到List所有的属性尽量收归
      // 到当前general；后续即使不设置`isIntervalTreeItem`的话，也最好将
      // isIntervalTreeItem
      style={contentContainerStyle}
      onMeasureLayout={onMeasureLayout}
      viewableItemHelperKey={viewableItemHelperKey}
      viewAbilityPropsSensitive={false}
      setMeasureLayoutHandler={setMeasureLayoutHandler}
    >
      <Content {...rest} listKey={listKey} />
    </ViewableItem>
  );
};

export default React.memo(ContextContent);

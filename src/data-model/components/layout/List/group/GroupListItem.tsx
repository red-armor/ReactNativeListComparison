import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  StickyItem as ScrollViewStickyItem,
  ViewableItem as ScrollViewViewableItem,
  ViewabilityContext,
} from '../../../container/ScrollView';
import context from './context';
import useMountItem from './hooks/useMountItem';

const GroupListItem = (props) => {
  const { children, isSticky, itemKey, onLayout, onViewable, onImpression } =
    props;

  const requireRender = useMountItem(props);
  const viewabilityContextValue = useContext(ViewabilityContext);
  const listGroupDimensions = useMemo(
    () => viewabilityContextValue.dimensions,
    [viewabilityContextValue]
  );
  const itemMeta = useMemo(
    () => listGroupDimensions.getKeyMeta(itemKey, itemKey),
    [listGroupDimensions]
  );

  useEffect(() => {
    return itemMeta?.addStateEventListener('viewable', (viewable) => {
      if (typeof onViewable === 'function') {
        onViewable(viewable);
      }
    });
  }, [onViewable]);

  useEffect(() => {
    const dimensions = viewabilityContextValue.dimensions;
    const meta = dimensions.getKeyMeta(itemKey, itemKey);
    return meta?.addStateEventListener('impression', () => {
      if (typeof onImpression === 'function') onImpression();
    });
  }, [onImpression]);

  const C = useMemo(
    () => (isSticky ? ScrollViewStickyItem : ScrollViewViewableItem),
    []
  );
  const onLayoutHandler = useCallback(
    (layout: any) => {
      if (typeof onLayout === 'function') onLayout(layout);
    },
    [onLayout]
  );

  if (!requireRender) return null;

  return (
    <C
      ownerId={itemKey}
      isIntervalTreeItem
      onMeasureLayout={onLayoutHandler}
      viewableItemHelperKey={itemKey}
    >
      {children}
    </C>
  );
};

const MemoedGroupListItem = React.memo(GroupListItem, (prev, cur) => {
  if (cur.changed) return true;

  const keys = Object.keys(prev);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (prev[key] !== cur[key]) {
      return false;
    }
  }
  return true;
});

const GroupListItemWrapper = (props) => {
  const contextValues = useContext(context);
  const contextValuesRef = useRef(contextValues);
  let changed = false;

  if (
    contextValuesRef.current.inspectingTimes !== contextValues.inspectingTimes
  ) {
    contextValuesRef.current.heartBeat({
      inspectingTime: contextValues.inspectingTime,
      listKey: props.itemKey,
    });
    contextValuesRef.current = contextValues;
    changed = true;
  }
  return <MemoedGroupListItem {...props} changed={changed} />;
};

export default GroupListItemWrapper;

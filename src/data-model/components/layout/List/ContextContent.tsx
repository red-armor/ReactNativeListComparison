import { ItemsDimensions, ListDimensions } from '@infinite-list/data-model';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { View } from 'react-native';

import {
  ScrollViewContext,
  ViewabilityContext,
  ViewableItem,
} from '../../container/ScrollView';
import ContentWithRecycle from './ContentWithRecycle';
import ContentWithSpace from './ContentWithSpace';

/**
 *
 * @param props
 * @returns
 *
 * 之所以将intervalTree提到这一层，因为当提供了getItemLayout以后，其实对于List它的Layout
 * 是一个已知的结果，这个会直接印象在渲染时`computeWindowedRenderLimits`的计算，因为如果
 * getItemLayout被提供的话，那么data是默认被渲染完了，也就是会印象下面的逻辑处理
 *
 * ```ts
 * if (
    // 证明所有的item都已经layout渲染完毕，
    viewabilityGeneral.getIntervalTree().getMaxUsefulLength() ===
    listData.length
  ) {
    const maxContentLength =
      Math.min(contentLength, logicalMaxOffset) - listContainerOffset;
    nextEndIndex = viewabilityGeneral.greatestLowerBound(maxContentLength);
  }
 * ```
 */
const ContextContent = props => {
  const scrollViewContextValue = useContext(ScrollViewContext);
  const {
    marshal,
    getScrollHelper,
    scrollEventHelper,
  } = scrollViewContextValue;
  const scrollHelper = getScrollHelper();
  const {
    listKey,
    data: listData,
    contentContainerStyle,
    getItemLayout,
    keyExtractor,
    viewabilityConfig,
    onViewableItemsChanged,
    getItemSeparatorLength,
    viewabilityConfigCallbackPairs,

    onUpdateIntervalTree,
    onUpdateItemLayout,
    setInstance,
    onMeasureLayout: _onMeasureLayout,
    windowSize,
    initialNumToRender,
    maxToRenderPerBatch,
    viewAbilityPropsSensitive = true,
    onEndReached,
    onEndReachedThreshold,
    onEndReachedTimeoutThreshold,
    onEndReachedHandlerTimeoutThreshold,
    deps,
    dispatchMetricsThreshold,
    recycleBufferedCount,
    recycleEnabled = false,

    itemApproximateLength,
    ...rest
  } = props;
  const contentRef = useRef();
  const viewableItemHelperKey = useMemo(() => `${listKey}_context_content`, []);

  const ContentComponent = recycleEnabled
    ? ContentWithRecycle
    : ContentWithSpace;

  const getContainerLayout = useCallback(() => {
    const dimensions = marshal.getRootScrollHelper().getMarshal().dimensions;
    const helper = (dimensions as ItemsDimensions).getKeyMeta(
      viewableItemHelperKey
    );
    return helper?.getLayout();
  }, []);

  console.log('dispatchMetricsThreshold ', recycleBufferedCount, dispatchMetricsThreshold )

  const contextValues = useMemo(() => {
    const dimensions = new ListDimensions({
      deps,
      data: listData,
      recycleEnabled,
      getItemLayout,
      getItemSeparatorLength,
      windowSize,
      maxToRenderPerBatch,
      keyExtractor,
      viewabilityConfig,
      getContainerLayout,
      initialNumToRender,
      onUpdateIntervalTree,
      onUpdateItemLayout,
      onViewableItemsChanged,
      id: listKey,
      viewabilityConfigCallbackPairs,
      recycleBufferedCount,

      // 主要是解决List Item中存在自由职业的viewableItem时如何判断viewable
      parentItemsDimensions: marshal.getRootScrollHelper().getMarshal()
        .dimensions as ItemsDimensions,
      onEndReached,
      onEndReachedThreshold,
      onEndReachedTimeoutThreshold,
      dispatchMetricsThreshold,
      // useItemApproximateLayout,
      itemApproximateLength,
      onEndReachedHandlerTimeoutThreshold,
      useItemApproximateLength: false
    });

    if (typeof setInstance === 'function') {
      setInstance({
        dimensions,
      });
    }
    return { dimensions };
  }, []);

  useEffect(() => {
    contextValues.dimensions.setOnEndReached(onEndReached)
  }, [onEndReached])

  const dataRef = useRef(listData);
  const scrollMetricsRef = useRef<any>();

  if (dataRef.current !== listData) {
    contextValues.dimensions.setData(listData);
    dataRef.current = listData;
  }

  useEffect(() => {
    contextValues.dimensions.setOnEndReached(onEndReached);
  }, [onEndReached]);

  const onMeasureLayout = useMemo(() => {
    if (typeof _onMeasureLayout === 'function') {
      return (x, y, w, h) => {
        _onMeasureLayout(x, y, w, h);
      };
    }
    return null;
  }, [listKey]);

  const measureLayoutHandlerRef = useRef<Function>();
  const setMeasureLayoutHandler = useCallback(handler => {
    measureLayoutHandlerRef.current = handler;
  }, []);

  // 当root scrollHelper中触发了contentSizeChange的时候，需要对container的layout
  // 进行重新计算
  useEffect(
    () =>
      scrollEventHelper.subscribeEventHandler('onContentSizeChange', () => {
        const scrollMetrics = scrollHelper.getScrollMetrics();
        if (scrollMetrics !== scrollMetricsRef.current) {
          contextValues.dimensions.updateScrollMetrics(
            scrollHelper.getScrollMetrics()
          );

          scrollMetricsRef.current = scrollMetrics;
        }

        // 当整体的size发生变化以后，主动触发一次layout更新
        if (typeof measureLayoutHandlerRef.current === 'function') {
          measureLayoutHandlerRef.current();
        }
      }),
    []
  );

  // const dateRef = useRef(Date.now())

  useEffect(
    () =>
      scrollEventHelper.subscribeEventHandler('onScroll', () => {
        // console.log('elapsed ', Date.now() - dateRef.current)
        // dateRef.current = Date.now()
        const scrollMetrics = scrollHelper.getScrollMetrics();
        if (scrollMetrics !== scrollMetricsRef.current) {
          contextValues.dimensions.updateScrollMetrics(
            scrollHelper.getScrollMetrics()
          );

          scrollMetricsRef.current = scrollMetrics;
        }
      }),
    []
  );

  useEffect(
    () =>
      scrollEventHelper.subscribeEventHandler('onMomentumScrollEnd', () => {
        const scrollMetrics = scrollHelper.getScrollMetrics();
        if (scrollMetrics !== scrollMetricsRef.current) {
          contextValues.dimensions.updateScrollMetrics(
            scrollHelper.getScrollMetrics()
          );

          scrollMetricsRef.current = scrollMetrics;
        }
      }),
    []
  );

  useEffect(
    () => () => {
      contextValues.dimensions.cleanup();
    },
    [contextValues.dimensions]
  );

  const styleProps = useMemo(
    () =>
      contentContainerStyle
        ? {
            style: contentContainerStyle,
          }
        : {},
    [contentContainerStyle]
  );

  return (
    <ViewableItem
      // @ts-ignore
      ref={contentRef}
      // TODO：getContainerOffset会涉及到从`general`中拿对应的值；但是在`useViewable`
      // 已经将非ListItem的数据放置到了顶层；但是，目前考虑到List所有的属性尽量收归
      // 到当前general；后续即使不设置`isIntervalTreeItem`的话，也最好将
      listKey={listKey}
      onMeasureLayout={onMeasureLayout}
      viewableItemHelperKey={viewableItemHelperKey}
      setMeasureLayoutHandler={setMeasureLayoutHandler}
      viewAbilityPropsSensitive={false}
      {...styleProps}
    >
      <ViewabilityContext.Provider value={contextValues}>
        <ContentComponent
          {...rest}
          listKey={listKey}
          WrapperComponent={
            contentContainerStyle && recycleEnabled ? View : React.Fragment
          }
          viewAbilityPropsSensitive={viewAbilityPropsSensitive}
        />
      </ViewabilityContext.Provider>
    </ViewableItem>
  );
};

export default ContextContent;

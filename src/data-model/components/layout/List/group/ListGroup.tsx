import { ListGroupDimensions } from '@infinite-list/data-model';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

import {
  ScrollViewContext,
  ViewabilityContext,
  useMeasureLayout,
} from '../../../container/ScrollView';
import { ListGroupProps } from '../types';
import context from './context';

const ListGroup: FC<ListGroupProps> = (props) => {
  const {
    children,
    id,
    onViewableItemsChanged,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    initialNumToRender,
    onRenderFinished,
    persistanceIndices,
  } = props;
  const { marshal, scrollEventHelper, getScrollHelper } =
    useContext(ScrollViewContext);
  const layoutRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  const viewRef = useRef<View>();
  const measureLayout = useCallback(
    (x: number, y: number, width: number, height: number) => {
      layoutRef.current = { x, y, width, height };
    },
    []
  );

  const scrollMetricsRef = useRef<any>();

  const scrollHelper = getScrollHelper();

  const { handler, layoutHandler } = useMeasureLayout(
    viewRef,
    marshal.getRootRef(),
    {
      onMeasureLayout: measureLayout,
    }
  );

  const getContainerLayout = useCallback(() => layoutRef.current, []);

  const ctx = useMemo(() => {
    const dimensions = new ListGroupDimensions({
      id,
      viewabilityConfig,
      getContainerLayout,
      initialNumToRender,
      persistanceIndices,
      onViewableItemsChanged,
      viewabilityConfigCallbackPairs,
    });
    return { dimensions };
  }, []);

  useEffect(() => {
    let removeRenderStateListener;
    if (typeof onRenderFinished === 'function') {
      removeRenderStateListener =
        ctx.dimensions.addRenderStateListener(onRenderFinished);
    }
    return () => {
      if (removeRenderStateListener) removeRenderStateListener();
    };
  }, [onRenderFinished]);

  useEffect(
    () =>
      scrollEventHelper.subscribeEventHandler('onContentSizeChange', () => {
        if (typeof handler === 'function') {
          handler();
        }
        const scrollMetrics = scrollHelper.getScrollMetrics();
        if (scrollMetrics !== scrollMetricsRef.current) {
          ctx.dimensions.updateScrollMetrics(scrollHelper.getScrollMetrics());
          scrollMetricsRef.current = scrollMetrics;
        }
      }),
    []
  );

  useEffect(
    () => () => {
      ctx.dimensions.cleanup();
    },
    []
  );

  useEffect(
    () =>
      scrollEventHelper.subscribeEventHandler('onScroll', () => {
        const scrollMetrics = scrollHelper.getScrollMetrics();
        if (scrollMetrics !== scrollMetricsRef.current) {
          ctx.dimensions.updateScrollMetrics(scrollHelper.getScrollMetrics());
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
          ctx.dimensions.updateScrollMetrics(scrollHelper.getScrollMetrics());
          scrollMetricsRef.current = scrollMetrics;
        }
      }),
    []
  );

  useEffect(() => {
    ctx.dimensions.updateScrollMetrics(scrollHelper.getScrollMetrics());
  }, []);

  useEffect(
    () => () => {
      ctx.dimensions.cleanup();
    },
    []
  );

  const [state, setState] = useState(() => ctx.dimensions.getInspectAPI());

  useEffect(() => {
    return ctx.dimensions.addStartInspectingHandler((props) => {
      setState(props);
    });
  }, []);

  return (
    <View onLayout={layoutHandler} ref={viewRef}>
      <context.Provider value={state}>
        <ViewabilityContext.Provider value={ctx}>
          {children}
        </ViewabilityContext.Provider>
      </context.Provider>
    </View>
  );
};

export default ListGroup;

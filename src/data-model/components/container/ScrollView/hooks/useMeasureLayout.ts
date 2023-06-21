import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Platform, LayoutChangeEvent } from 'react-native';
import { measureLayout } from '../../../../utils';

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const isIos = Platform.OS === 'ios'

export default (
  itemRef: MutableRefObject<React.Component<any, any>>,
  container: MutableRefObject<React.Component<any, any>>,
  options: {
    onLayout?: Function;
    getCurrentKey?: () => string;
    isIntervalTreeItem?: boolean;
    onMeasureLayout?: Function;
  }
) => {
  const { onMeasureLayout: _onMeasureLayout, onLayout, isIntervalTreeItem } = options || {};
  const onMeasureLayout = useCallback((newLayout: Layout) => {
    if (typeof _onMeasureLayout === 'function') {
      _onMeasureLayout(
        newLayout.x,
        newLayout.y,
        newLayout.width,
        newLayout.height
      );
    }
  }, []);
  const layoutHandler = useMemo(
    () => (e: LayoutChangeEvent) => {
      if (typeof onLayout === 'function') onLayout(e);
      // console.log('layout handelr value ', getCurrentKey())
      onMeasureLayout(e.nativeEvent.layout);
    },
    [onLayout]
  );

  const handler = useCallback(() => {
    if (!itemRef.current) return;

    try {
      measureLayout(
        // @ts-ignore
        itemRef.current,
        // TODO：貌似这有问题。。。其实貌似需要拿对应的rootScrollHelper
        container.current,
        () => {
          console.warn(
            "useViewable: Encountered an error while measuring a list's" +
              ' offset from its containing ScrollView.'
          );
        },
        (x, y, width, height) => {
          onMeasureLayout({ x, y, width, height });
        }
      );
    } catch (error) {
      console.warn('useMeasureLayout threw an error', error.stack);
    }
  }, []);

  useEffect(() => {
    // 这个主要是解如果不是list的话，onLayout给出的y是0
    if (!isIntervalTreeItem) setTimeout(() => handler(), isIos ? 0 : 50);
  }, []);

  return {
    handler,
    layoutHandler,
  };
};

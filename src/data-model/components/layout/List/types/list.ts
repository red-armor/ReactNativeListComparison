import { ListDimensions ,
  ViewabilityConfig,
  ViewabilityConfigCallbackPairs,
} from '@infinite-list/data-model';
import { FlatListProps } from 'react-native';

import { OnMeasureLayout } from '../../../container/ScrollView/types';

export type DefaultItemT = {
  [key: string]: any;
};

export type GetItemSeparatorLength<ItemT> = (
  data: ItemT[],
  index: number
) => { length: number };
export type GetItemLayout<ItemT> = (
  data: ItemT[],
  index: number
) => { length: number; index: number };

export type TeleportItemProps = ((opts: { index: number; item: any }) => {
  [key: string]: any;
}) | undefined;

export type MeasureItemLayout = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OnMeasureItemLayout = (opts: MeasureItemLayout) => void;

// https://www.typescriptlang.org/docs/handbook/interfaces.html#extending-interfaces
// @ts-ignore
export interface ListProps<ItemT extends DefaultItemT> extends FlatListProps<ItemT> {
  id?: string;
  data: ItemT[];
  renderItem: RenderItem<ItemT>;

  initialSize?: number;

  deps?: string[];

  onEndReachedTimeoutThreshold?: number;
  viewabilityConfig?: ViewabilityConfig;
  viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs;

  getItemLayout?: GetItemLayout<ItemT>;
  getItemSeparatorLength?: GetItemSeparatorLength<ItemT>;

  teleportItemProps?: TeleportItemProps;

  recycleEnabled?: boolean;

  /**
   * indicate indices will not be released on scroll.
   */
  persistentIndices?: number[];

  onUpdateIntervalTree?: (heap: number[]) => void;
  onUpdateItemLayout?: (index: number, length: number) => void;

  onMeasureItemLayout?: OnMeasureItemLayout;
  // 主要是为了解决onEndReached场景下，不能够连续触发onEndReached handler
  onEndReachedHandlerTimeoutThreshold?: number;

  setInstance?: (props: { dimensions: ListDimensions }) => void;

  onMeasureLayout?: OnMeasureLayout;

  viewAbilityPropsSensitive?: boolean;

  dispatchMetricsThreshold?: number;
}

export type KeyExtractor<ItemT> = (item: ItemT, index: number) => string;

export type RenderItemInfo<ItemT> = {
  item: ItemT;
  index: number;
};

export type RenderItem<ItemT extends DefaultItemT> = (
  info: RenderItemInfo<ItemT>
) => React.ReactElement | null;

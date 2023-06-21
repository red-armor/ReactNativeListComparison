import { ListDimensions, ListGroupDimensions } from '@infinite-list/data-model';

import { DefaultItemT, RenderItem, TeleportItemProps } from './list';

type ContentOnMeasureLayout<T> = (opts: {
  x: number;
  y: number;
  width: number;
  height: number;
  itemKey: string;
  item: T;
}) => void;

type MeasureLayout = ((
  x: number,
  y: number,
  width: number,
  height: number
) => void) | null;

type ItemDefaultProps<ItemT extends DefaultItemT> = {
  listKey: string;

  ownerId?: string;

  isListItem?: boolean;

  item: ItemT;

  // item的渲染不再引入index；index最好不能够作为props
  itemKey: string;

  // release?: boolean;

  dimensions: ListDimensions | ListGroupDimensions;

  renderItem: RenderItem<ItemT>;

  teleportItemProps?: TeleportItemProps;

  ItemSeparatorComponent?: React.ComponentType<any> | null | undefined;

  CellRendererComponent?: React.ComponentType<any> | undefined;

  viewAbilityPropsSensitive?: boolean;
};

export type ItemProps<ItemT extends DefaultItemT> = ItemDefaultProps<ItemT> & {
  isHeadItem?: boolean;
  isStickyItem?: boolean;
  stickyHeaderIndices?: number[];
  onMeasureLayout?: ContentOnMeasureLayout<ItemT> | null;
  CellRendererComponent?: React.ComponentType<any> | undefined;
};

export type ListViewableItemProps<ItemT extends DefaultItemT> = ItemDefaultProps<ItemT> & {
  measureLayoutHandler: MeasureLayout;
  viewableItemHelperKey: string;
};

export type ListStickyItemProps<ItemT extends DefaultItemT> = ItemDefaultProps<ItemT> & {
  measureLayoutHandler: MeasureLayout;
  viewableItemHelperKey: string;
};

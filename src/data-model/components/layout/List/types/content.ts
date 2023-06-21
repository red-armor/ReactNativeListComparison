import { ViewStyle } from 'react-native';

import {
  DefaultItemT,
  OnMeasureItemLayout,
  RenderItem,
  TeleportItemProps,
} from './list';

export interface ContentProps<PP extends DefaultItemT> {
  listKey: string;
  style?: ViewStyle;
  teleportItemProps?: TeleportItemProps;
  renderItem: RenderItem<PP>;
  ItemSeparatorComponent?: React.ComponentType<any> | null | undefined;
  onMeasureItemLayout?: OnMeasureItemLayout;
  CellRendererComponent?: React.ComponentType<any> | undefined;
  viewAbilityPropsSensitive?: boolean;

  WrapperComponent?: React.ComponentType<any>;
}

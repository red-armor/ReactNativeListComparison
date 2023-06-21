import { StyleProp, ViewStyle } from 'react-native';

export type ListFooterComponent =
  | React.ComponentType<any>
  | React.ReactElement
  | null;

export type FooterProps = {
  ListFooterComponent?: ListFooterComponent;
  ListFooterComponentStyle?: StyleProp<ViewStyle>;
};

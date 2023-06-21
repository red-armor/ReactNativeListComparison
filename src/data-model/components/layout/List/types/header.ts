import { StyleProp, ViewStyle } from 'react-native';

export type ListHeaderComponent =
  | React.ComponentType
  | React.ReactElement
  | null;

export type HeaderProps = {
  ListHeaderComponent?: ListHeaderComponent;
  ListHeaderComponentStyle?: StyleProp<ViewStyle>;
};

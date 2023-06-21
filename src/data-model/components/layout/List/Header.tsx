import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { HeaderProps } from './types';

const Header: FC<HeaderProps> = (props) => {
  const { ListHeaderComponent, ListHeaderComponentStyle } = props;

  const style = useMemo(() => {
    if (ListHeaderComponentStyle) return ListHeaderComponentStyle;
    return {};
  }, [ListHeaderComponentStyle]);

  if (!ListHeaderComponent) return null;

  if (React.isValidElement(ListHeaderComponent)) return ListHeaderComponent;

  return (
    <View style={style}>
      <ListHeaderComponent />
    </View>
  );
};

export default Header;

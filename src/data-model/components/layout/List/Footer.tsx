import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { FooterProps } from './types';

const Footer: FC<FooterProps> = (props) => {
  const { ListFooterComponent, ListFooterComponentStyle } = props;
  const style = useMemo(() => {
    if (ListFooterComponentStyle) return ListFooterComponentStyle;
    return {};
  }, [ListFooterComponentStyle]);
  if (!ListFooterComponent) return null;

  if (React.isValidElement(ListFooterComponent)) return ListFooterComponent;
  return (
    <View style={style}>
      <ListFooterComponent />
    </View>
  );
};

export default Footer;

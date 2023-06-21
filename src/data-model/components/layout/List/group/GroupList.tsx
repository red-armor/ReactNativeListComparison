import { defaultKeyExtractor } from '@infinite-list/data-model';
import React, { PropsWithChildren, useContext, useRef } from 'react';

import { DefaultItemT, GroupListProps } from '../types';
import List from './List';
import context from './context';
import useMountList from './hooks/useMountList';

const GroupList = <ItemT extends DefaultItemT>(
  props: PropsWithChildren<GroupListProps<ItemT>>
) => {
  const { data, keyExtractor = defaultKeyExtractor, id, ...rest } = props;
  useMountList(props);
  return <List {...rest} data={data} keyExtractor={keyExtractor} id={id} />;
};

const MemoedGroupList = React.memo(GroupList, (prev, cur) => {
  // @ts-ignore
  if (cur.changed) return true;

  const keys = Object.keys(prev);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (prev[key] !== cur[key]) {
      return false;
    }
  }
  return true;
});

const GroupListWrapper = (props) => {
  const contextValues = useContext(context);
  const contextValuesRef = useRef(contextValues);
  let changed = false;

  if (
    contextValuesRef.current.inspectingTimes !== contextValues.inspectingTimes
  ) {
    contextValuesRef.current.heartBeat({
      inspectingTime: contextValues.inspectingTime,
      listKey: props.id,
    });
    contextValuesRef.current = contextValues;
    changed = true;
  }
  return <MemoedGroupList {...props} changed={changed} />;
};

export default GroupListWrapper;

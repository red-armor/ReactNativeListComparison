import { ListDimensions } from '@infinite-list/data-model';
import React, { useContext, useEffect, useMemo, memo, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import resolveChanged from '@x-oasis/resolve-changed'

import { ViewabilityContext } from '../../container/ScrollView';
import Item from './item';
import { ContentProps, DefaultItemT } from './types';
import shallowEqual from '@x-oasis/shallow-equal';

const RecycleContentItem = props => {
  const { 
    listKey,
    renderItem,
    teleportItemProps,
    ItemSeparatorComponent,
    dimensions,
    CellRendererComponent,
    viewAbilityPropsSensitive = true,
    onMeasureItemLayout,
    item, 
    isSticky, 
    // offset, 
    targetKey,
    containerKey,
    forwardRef,
    index,
    setRef,
  } = props

  const containerStyle = useMemo(() => ({
    position: 'absolute',
    // top:  -4000,
    left: 0,
    right: 0,
  }), [])

  const offsetRef = useRef()
  // const ref = useRef()

  // console.log('dimensions.getKeyMeta(targetKey).isApproximateLayout ', dimensions.getKeyMeta(targetKey).isApproximateLayout)

  // if (offsetRef.current !== offset && (ref.current)) {
  //   offsetRef.current !== offset
  //   ref.current.setNativeProps({
  //     position: 'absolute',
  //     top: dimensions.getKeyMeta(targetKey).isApproximateLayout ? -4000 : offset,
  //     left: 0,
  //     right: 0,
  //   })
  // }

  useEffect(() => {
    setRef(index, offsetRef)
    // refs[index] = offsetRef
  }, [])

  return (
    <View style={containerStyle} ref={offsetRef}>
      <Item
        item={item}
        // style={containerStyle}
        itemKey={targetKey}
        listKey={listKey}
        ownerId={listKey}
        containerKey={containerKey}
        renderItem={renderItem}
        isStickyItem={isSticky}
        dimensions={dimensions}
        onMeasureLayout={onMeasureItemLayout}
        teleportItemProps={teleportItemProps}
        viewAbilityPropsSensitive={viewAbilityPropsSensitive}
        ItemSeparatorComponent={ItemSeparatorComponent}
        CellRendererComponent={CellRendererComponent}
      />
    </View>    
  )
}

const MemoedRecycleContentItem = memo(RecycleContentItem)
// const MemoedRecycleContentItem = memo(React.forwardRef((props, ref) => <RecycleContentItem {...props} forwardRef={ref} />))

const RecycleContent = props => {
  const { state, ...rest } = props
  const stateRef = useRef(state)
  const refs = useMemo(() => [], [])
  const dimensions = props.dimensions

  const setRef = useCallback((index, ref) => {
    refs[index] = ref
  }, [])

  useEffect(() => {
    state.map((s, index) => {
      const { offset, targetKey } = s
      const old = stateRef.current?.[index]

      // setTimeout(() => {
        refs[index].current?.setNativeProps({
          position: 'absolute',
          top:  offset,
          left: 0,
          right: 0,
        })
      // })

      // console.log('refs[index].current ', refs[index].current)

      // if (!old) {
      //   console.log('old ==========')
      //   setTimeout(() => {
      //     refs[index].current?.setNativeProps({
      //       position: 'absolute',
      //       top: offset,
      //       left: 0,
      //       right: 0,
      //     })
      //   })
      // } else if (s.offset !== old.offset) {

      //   console.log('jdlfalflasfjklsajklfa--------', index, targetKey, dimensions.getKeyMeta(targetKey).isApproximateLayout, offset, !!refs[index].current)


      //   setTimeout(() => {
      //     refs[index].current?.setNativeProps({
      //       position: 'absolute',
      //       top:  offset,
      //       left: 0,
      //       right: 0,
      //     })
      //   })
      // }
    })

    stateRef.current = state
  }, [state])

  // useEffect(() => {
  //   const now = Date.now()
  //   // console.log('start ========', now)
  //   const changed = resolveChanged(stateRef.current, state, shallowEqual)
  //   if (changed.added.length) {
  //     console.log('added ', changed.added.map(({
  //       key, itemMeta, length, ...rest
  //     }) => ({
  //       key,
  //       length,    
  //       index: itemMeta.getIndexInfo().index,
  //       viewable: itemMeta.getState().viewable,
  //       ...rest
  //     })))
  //   }
  //   if (changed.removed.length) {
  //     console.log('removed ', changed.removed.map(({
  //       key, itemMeta, length, ...rest
  //     }) => ({
  //       key,
  //       length,    
  //       index: itemMeta.getIndexInfo().index,
  //       viewable: itemMeta.getState().viewable,
  //       ...rest,
  //     })))
  //   }
  //   console.log('end =========', now)
  //   stateRef.current = state
  // }, [state])

  return (
    state.map((stateResult, index) => {
      const { key, offset, length, ...stateResultRest } = stateResult;


      return (
        <MemoedRecycleContentItem 
          key={key}
          setRef={setRef}
          index={index}
          // ref={refs[index]}
          containerKey={key}
          {...rest}
          {...stateResultRest}
        />
      )
    })  
  )
}
const MemoedRecycleContent = memo(RecycleContent, (prev, next) => prev.state === next.state)

const SpaceContent = props => {
  const { state,
    listKey,
    renderItem,
    teleportItemProps,
    ItemSeparatorComponent,
    dimensions,
    CellRendererComponent,
    viewAbilityPropsSensitive = true,
    onMeasureItemLayout,
  } = props

  return (
    state.map((stateResult, index) => {
      const { isSpace, key, item, length, isSticky } = stateResult;
      return isSpace ? (
        <View key={key} style={{ height: length }} />
      ) : (
        <Item
          item={item}
          key={key}
          itemKey={key}
          listKey={listKey}
          ownerId={listKey}
          isHeadItem={!index}
          renderItem={renderItem}
          isStickyItem={isSticky}
          dimensions={dimensions}
          onMeasureLayout={onMeasureItemLayout}
          teleportItemProps={teleportItemProps}
          viewAbilityPropsSensitive={viewAbilityPropsSensitive}
          ItemSeparatorComponent={ItemSeparatorComponent}
          CellRendererComponent={CellRendererComponent}
        />
      );
    })    
  )
}
const MemoedSpaceContent = memo(SpaceContent, (prev, next) => prev.state === next.state)

/**
 *
 * @param props
 * @returns
 *
 * intervalTree先行，因为这个是一个静态的东西；至于viewableItemHelper的话后续会进行
 * 值的补充
 */
const Content = <ItemT extends DefaultItemT>(props: ContentProps<ItemT>) => {
  const {
    listKey,
    renderItem,
    teleportItemProps,
    ItemSeparatorComponent,
    onMeasureItemLayout,
    CellRendererComponent,
    WrapperComponent = React.Fragment,
    viewAbilityPropsSensitive = true,
  } = props;
  const viewabilityContextValue = useContext(ViewabilityContext);

  const dimensions = viewabilityContextValue.dimensions as ListDimensions;

  const [state, setState] = useState<any>(dimensions.stateResult);

  useEffect(
    () =>
      dimensions.addStateListener(newState => {
        setState(newState);
      }),
    []
  );

  const _onMeasureItemLayout = useMemo(() => {
    if (typeof onMeasureItemLayout === 'function') {
      return ({ height, itemKey, width, x, y }) => {
        if (typeof onMeasureItemLayout === 'function') {
          onMeasureItemLayout({
            x,
            y,
            width,
            height,
            key: itemKey,
          });
        }
      };
    }

    return null;
  }, []);

  // console.log('state recycle ', state.recycleState.map(({
  //   key, itemMeta, length, 
  // }) => ({
  //   key,
  //   length,

  //   index: itemMeta.getIndexInfo().index,
  //   viewable: itemMeta.getState().viewable,
  // })))

  return (
    // if container has style, then absolute item should be wrapped in View Component
    <WrapperComponent>
      <MemoedSpaceContent
        state={state.spaceState}
        listKey={listKey}
        ownerId={listKey}
        renderItem={renderItem}
        dimensions={dimensions}
        onMeasureLayout={_onMeasureItemLayout}
        teleportItemProps={teleportItemProps}
        viewAbilityPropsSensitive={viewAbilityPropsSensitive}
        ItemSeparatorComponent={ItemSeparatorComponent}
        CellRendererComponent={CellRendererComponent}                
      />

      <MemoedRecycleContent
        state={state.recycleState}
        listKey={listKey}
        ownerId={listKey}
        renderItem={renderItem}
        dimensions={dimensions}
        onMeasureLayout={_onMeasureItemLayout}
        // teleportItemProps={teleportItemProps}
        viewAbilityPropsSensitive={viewAbilityPropsSensitive}
        ItemSeparatorComponent={ItemSeparatorComponent}
        CellRendererComponent={CellRendererComponent}                
      />
    </WrapperComponent>
  );
};

export default React.memo(Content);

import {
  HostComponent,
  MeasureInWindowOnSuccessCallback,
  MeasureLayoutOnSuccessCallback,
  UIManager,
  findNodeHandle,
} from 'react-native';

// @ts-ignore
const isFabric = global.isFabric;

export function measureInWindow(
  relativeToNativeComponentRef: HostComponent<unknown> | number,
  callback: MeasureInWindowOnSuccessCallback
) {
  if (isFabric) {
    // @ts-ignore
    relativeToNativeComponentRef.measureInWindow(callback);
  } else {
    UIManager.measureInWindow(
      findNodeHandle(relativeToNativeComponentRef),
      callback
    );
  }
}

export function measureLayout(
  node: HostComponent<unknown> | number,
  relativeToNativeNode: HostComponent<unknown> | number,
  onFail: () => void,
  onSuccess: MeasureLayoutOnSuccessCallback
) {
  if (isFabric) {
    // @ts-ignore
    node.measureLayout(relativeToNativeNode, onSuccess, onFail);
  } else {
    UIManager.measureLayout(
      findNodeHandle(node),
      findNodeHandle(relativeToNativeNode),
      onFail,
      onSuccess
    );
  }
}

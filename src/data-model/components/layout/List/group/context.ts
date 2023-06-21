import { createContext } from 'react';

const noop = () => {};

export default createContext<{
  inspectingTimes: number;
  inspectingTime: number;
  heartBeat: (props: { listKey: string; inspectingTime: number }) => void;
  startInspection: () => void;
}>({
  inspectingTimes: 0,
  inspectingTime: +Date.now(),
  heartBeat: noop,
  startInspection: noop,
});

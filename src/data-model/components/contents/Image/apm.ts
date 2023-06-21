// import { invoke } from '@xhs/ozone-schema';

import { ImageTrackerProps } from './types';

class ApmBatchinator {
  private _arr: ImageTrackerProps[];
  private _deviceLevel = -10;

  readonly _delayMS: number;

  constructor() {
    this.flush = this.flush.bind(this);
    this.send = this.send.bind(this);

    this._delayMS = 50;
    this._arr = [];

    // try {
    //   invoke('getHardWareLevel')
    //     .then((res) => {
    //       if (res.result === 0) {
    //         this._deviceLevel = res.value;
    //       }
    //     })
    //     .catch(() => {});
    // } catch (err) {
    //   // ...
    // }
  }

  send() {
    this._arr.forEach((item) => {
      const payload = {
        type: 'InfraRnImageRequest',
        value: item,
      };
      global.eaglet?.push(payload, 'ApmJSONTracker');
    });
    this._arr = [];
  }

  flush(payload: ImageTrackerProps) {
    // const { intersectTime, loadedTime, ...rest } = payload;

    global.eaglet?.push(
      {
        type: 'InfraRnImageRequest',
        value: {
          ...payload,
          deviceLevel: this._deviceLevel,
        },
      },
      'ApmJSONTracker'
    );
    // this._arr.push(payload);
    // this._bachinator.schedule();
  }
}

export default new ApmBatchinator();

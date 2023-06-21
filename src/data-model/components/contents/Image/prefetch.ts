import { Image } from 'react-native';

class PrefetchBatchinator {
  private _cancelHandler: {
    [key: string]: any;
  };

  readonly _delayMS: number;

  constructor() {
    this._delayMS = 50;
    this._cancelHandler = {};

    this.prefetch = this.prefetch.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  dispose(url: string) {
    this._cancelHandler[url]?.();

    delete this._cancelHandler.url;
  }

  disposeAll() {
    Object.values(this._cancelHandler).forEach((cancel) => {
      cancel?.();
    });

    this._cancelHandler = {};
  }

  prefetch(url: string) {
    if (this._cancelHandler[url]) {
      return;
    }

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        Image.prefetch(url);
      });
    }, this._delayMS);

    this._cancelHandler[url] = () => clearTimeout(timeout);
  }
}

export default new PrefetchBatchinator();

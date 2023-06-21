// import { invoke } from '@xhs/ozone-schema';
import { ImageStyle, PixelRatio, Platform, StyleProp } from 'react-native';

// export let isTestEnv = false;
// try {
//   invoke('getTrackEnv').then((res) => {
//     // TODO: Android 打开开关之后关不掉
//     isTestEnv = Platform.OS === 'android' ? false : res.value.isTestEnv;
//   });
// } catch (error) {}

const dpi = PixelRatio.get();

const IMAGE_SIZES = [50, 100, 150, 200, 320, 400, 640, 750, 800, 900, 1000];

const HOST_MAP = {
  'img.xiaohongshu.com': 'qimg.xiaohongshu.com',
  'ci.xiaohongshu.com': 'ci.xiaohongshu.com',
  'qimg.xiaohongshu.com': 'qimg.xiaohongshu.com',
};

export const defaultImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==';

export { IMAGE_SIZES, HOST_MAP };

function parseUrl(href: string): {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
} {
  const match = href.match(
    // eslint-disable-next-line
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  // @ts-ignore
  return (
    match && {
      href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

const normalizeUrl = (str: string) => {
  return str.replace(/.*\/\//, 'https://');
};

const normalizeWidth = (width: number) => {
  const nextWidth = dpi < 3 ? Math.max(1, Math.min(dpi, 2)) * width : 3 * width;
  const len = IMAGE_SIZES.length;
  for (let index = 0; index < len; index++) {
    const cur = IMAGE_SIZES[index];
    if (cur >= nextWidth) return cur;
  }
  return IMAGE_SIZES[len - 1];
};

export const resolveImageSize = (style: StyleProp<ImageStyle>) => {
  const nextStyle: any[] = [].concat(style as any).filter(Boolean);
  const len = nextStyle.length;
  let currentWidth = 0;
  let currentHeight = 0;
  for (let i = len - 1; i >= 0; i--) {
    const style = nextStyle[i];
    if (!currentWidth && style.width) {
      currentWidth = style.width;
    }
    if (!currentHeight && style.height) {
      currentHeight = style.height;
    }
  }

  return {
    width: currentWidth,
    height: currentHeight,
  };
};

type UriWithWidth = {
  uri: string;
  width: number;
  enableWebP?: boolean;
  quality?: number;
  keepQuery?: boolean;
};

type UriWithVendorWidth = {
  uri: string;
  vendorWidth: number;
  enableWebP?: boolean;
  quality?: number;
  keepQuery?: boolean;
};

export function formatUri(options: UriWithWidth | UriWithVendorWidth) {
  const { uri, enableWebP = true, quality = 80, keepQuery } = options;
  try {
    const width = (options as UriWithWidth).width;
    const vendorWidth = (options as UriWithVendorWidth).vendorWidth;
    if (!uri) {
      return uri;
    }

    if (typeof uri === 'number') {
      return uri;
    }

    if (uri.indexOf('watermark') !== -1) {
      return uri;
    }

    const normalizedUrl = normalizeUrl(uri);
    const { protocol, host, pathname, search } = parseUrl(normalizedUrl);
    const nextWidth = vendorWidth || normalizeWidth(width);

    // https://cloud.tencent.com/document/product/1246/45373 interlace/1
    const formatStr = `imageView2/2/w/${nextWidth}/q/${quality}`;

    const nextSearch =
      keepQuery && search ? `${search}&${formatStr}` : `?${formatStr}`;

    let href = `${protocol}//${host}${pathname}${nextSearch}`;

    if (enableWebP) {
      href += '/format/webp';
    }

    return href;
  } catch (e) {
    return uri;
  }
}

export function isLocalFile(path: string) {
  return /^(file:\/\/\/?[a-zA-Z]|\/[a-zA-Z])/.test(path);
}

export function isDataUri(path: string) {
  return /data:image\/\w+/i.test(path);
}

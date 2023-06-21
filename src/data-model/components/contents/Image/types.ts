import { ImageProps, ViewStyle } from 'react-native';

export interface SpectrumImageProps extends ImageProps {
  /** 是否开启图片格式转换、裁剪、压缩、质量变换	 */
  enableFormat?: boolean;
  /** 图片裁剪是否保留 query */
  keepQuery?: boolean;
  /** 图片缩略变换宽度，默认取 style 设置的宽度 * 设备的像素密度和字体缩放比 */
  vendorWidth?: number;
  /** 是否使用 webp 格式转换图片	 */
  enableWebP?: boolean;
  /** 图片质量变换	 */
  quality?: number;
  /** 是否关闭懒加载	 */
  persistance?: boolean;
  isThumb?: boolean;
  /** 失败指示器	 */
  showErrorIndicator?: boolean;

  /** 容器样式 */
  containerStyle?: ViewStyle;
  /** 取消渐显动画	 */
  cancelOpacityAnimation?: boolean;

  /** 取消图片 apm 性能点收集 */
  abortApmCollection?: boolean;
  /** 加载指示器 */
  showProgress?: boolean;
}

export interface ImageTrackerProps {
  imageUrl: string;
  imageHost: string;
  intersectTime: number;
  loadedTime: number;
  imageSize: number;
  isFirstScreen: boolean;
  isSuccess: boolean;
  errorReason: string;
  viewMetric: number;
  isThumb?: boolean;
  loadedStartTime: number;
}

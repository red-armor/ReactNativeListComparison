import React, {
  ForwardRefRenderFunction,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  ImageErrorEventData,
  ImageLoadEventData,
  ImageProgressEventDataIOS,
  ImageURISource,
  NativeSyntheticEvent,
  Platform,
  Image as RNImage,
  TouchableOpacity,
  View,
} from 'react-native';
import Url from 'url-parse';

import { ScrollViewContext , ViewableItemContext } from '../../container/ScrollView';

import apmBatchinator from './apm';
import styles from './styles';
import { ImageTrackerProps, SpectrumImageProps } from './types';
import { formatUri, isDataUri, isLocalFile, resolveImageSize } from './util';

const Image: ForwardRefRenderFunction<View, SpectrumImageProps> = (
  props,
  ref
) => {
  const {
    enableFormat = true,
    enableWebP,
    quality,
    vendorWidth,

    persistance = false,
    isThumb = false,
    showErrorIndicator = false,

    containerStyle = {},
    abortApmCollection = false,

    source,
    style,
    fadeDuration = 150,
    cancelOpacityAnimation = true,
    keepQuery = false,

    showProgress = false,

    onProgress,
    onLoadEnd,
    onError,
    onLoad,
    onLoadStart,
    ...rest
  } = props;
  const [isError, setIsError] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const imageOpacityAnimatedValueRef = useRef(
    new Animated.Value(!cancelOpacityAnimation && Platform.OS === 'ios' ? 0 : 1)
  );

  const { itemMeta } = useContext(ViewableItemContext);

  const [viewable, setViewable] = useState(
    itemMeta?.getState()?.viewable ?? false
  );
  const [imageViewable, setImageViewable] = useState(
    itemMeta?.getState()?.imageViewable ?? false
  );
  useEffect(() => {
    return itemMeta?.addStateEventListener?.(
      'viewable',
      (viewable?: boolean) => {
        setViewable(!!viewable);
      }
    );
  }, [itemMeta]);

  useEffect(() => {
    return itemMeta?.addStateEventListener?.(
      'imageViewable',
      (viewable?: boolean) => {
        setImageViewable(!!viewable);
      }
    );
  }, [itemMeta]);

  const scrollViewContextValue = useContext(ScrollViewContext);
  const { marshal } = scrollViewContextValue;

  const formatSource = useMemo(() => {
    if (
      typeof source === 'number' ||
      isLocalFile((source as ImageURISource).uri) ||
      isDataUri((source as ImageURISource).uri)
    ) {
      return source;
    }

    const imageSize = resolveImageSize(style);

    const uri = (source as ImageURISource).uri as string;
    const nextUri = enableFormat
      ? formatUri({
          uri,
          enableWebP,
          quality,
          vendorWidth,
          width:
            typeof imageSize.width === 'string' ? 375 : imageSize.width || 375,
          keepQuery,
        })
      : uri;

    return {
      uri: nextUri,
    };
  }, [
    source,
    style,
    enableFormat,
    enableWebP,
    quality,
    vendorWidth,
    keepQuery,
  ]);

  const apmDataRef = useRef<ImageTrackerProps>({
    imageUrl: '',
    imageHost: '',
    intersectTime: viewable ? Date.now() : 0,
    loadedTime: 0,
    imageSize: 0,
    isFirstScreen: false,
    isSuccess: false,
    errorReason: '',
    viewMetric: 0,
    isThumb,
    loadedStartTime: 0,
  });
  const apmDoneRef = useRef(false);

  useEffect(() => {
    try {
      const apmData = apmDataRef.current;
      if (
        typeof formatSource !== 'number' &&
        !isLocalFile((formatSource as ImageURISource).uri) &&
        !isDataUri((formatSource as ImageURISource).uri)
      ) {
        const imageInfo = new Url((formatSource as ImageURISource).uri);
        apmData.imageHost = imageInfo.origin;
        apmData.imageUrl = (formatSource as ImageURISource).uri;
      }
    } catch (error) {
      //
    }
  }, [formatSource]);

  const pushApmData = useCallback(() => {
    const apmData = apmDataRef.current;
    const viewMetric = apmData.loadedTime - apmData.intersectTime;
    apmData.viewMetric = viewMetric < 0 ? 0 : viewMetric;

    if (!apmDoneRef.current && apmData.imageUrl && !abortApmCollection) {
      apmDoneRef.current = true;

      apmBatchinator.flush(apmData);
    }
  }, [abortApmCollection]);

  // 判断首屏
  if (
    !apmDataRef.current.isFirstScreen &&
    !marshal?.getRootScrollHelper().hasInteraction &&
    viewable
  ) {
    apmDataRef.current.isFirstScreen = true;
  }

  useEffect(() => {
    const apmData = apmDataRef.current;
    if (!apmData.intersectTime && viewable) {
      apmData.intersectTime = Date.now();
      // 进入视窗前加载完成/失败
      if (apmData.loadedTime || apmData.errorReason) {
        pushApmData();
      }
    }
  }, [viewable, pushApmData]);

  const onLoadHandler = useCallback(
    (event: NativeSyntheticEvent<ImageLoadEventData>) => {
      apmDataRef.current.loadedTime = Date.now();
      apmDataRef.current.isSuccess = true;

      if (!cancelOpacityAnimation && Platform.OS === 'ios') {
        Animated.timing(imageOpacityAnimatedValueRef.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: fadeDuration,
        }).start();
      }

      onLoad?.(event);
    },
    [cancelOpacityAnimation, fadeDuration, onLoad]
  );

  const onLoadStartHandler = useCallback(() => {
    apmDataRef.current.loadedStartTime = Date.now();
    onLoadStart?.();
  }, [onLoadStart]);

  const onLoadEndHandler = useCallback(() => {
    const apmData = apmDataRef.current;
    // 进入视窗后加载成功/失败
    if (apmData.intersectTime) {
      pushApmData();
    }

    onLoadEnd?.();
  }, [onLoadEnd, pushApmData]);

  const onErrorHandler = useCallback(
    (event: NativeSyntheticEvent<ImageErrorEventData>) => {
      apmDataRef.current.isSuccess = false;
      apmDataRef.current.errorReason = `${event.nativeEvent.error}`;

      setIsError(true);
      onError?.(event);
    },
    [onError]
  );

  const [, setProgress] = useState(0);
  const onProgressHandler = useCallback(
    (event: NativeSyntheticEvent<ImageProgressEventDataIOS>) => {
      const {
        nativeEvent: { total, loaded },
      } = event;

      if (total) {
        setProgress(loaded / total);
      }
      apmDataRef.current.imageSize = total;
      onProgress?.(event);
    },
    [onProgress]
  );

  const showImageCmp = useMemo(() => {
    return (
      // 没有在 ScrollView 中使用
      !marshal ||
      // // 在视窗内
      viewable !== false ||
      // // 在预加载视窗内
      imageViewable !== false ||
      // 手动持久化
      persistance
    );
  }, [marshal, viewable, imageViewable, persistance]);

  const containerMemoStyle = useMemo(() => {
    return [styles.image, style, containerStyle];
  }, [containerStyle, style]);

  const reloadImage = useCallback(() => {
    setShowImage(false);
    setTimeout(() => {
      setShowImage(true);
    }, 0);
  }, []);

  const animatedImageStyle = useMemo(() => {
    return [
      styles.image,
      style,
      {
        opacity: imageOpacityAnimatedValueRef.current,
      },
    ];
  }, [style]);

  // const showProgressIndicator = useMemo(() => {
  //   return showProgress && progress !== 0 && progress !== 1 && viewable;
  // }, [showProgress, progress, viewable]);

  return (
    <View style={containerMemoStyle} ref={ref}>
      {showImageCmp && showImage && (
        <Animated.Image
          source={formatSource}
          fadeDuration={fadeDuration}
          onLoad={onLoadHandler}
          onLoadStart={onLoadStartHandler}
          onLoadEnd={onLoadEndHandler}
          onError={onErrorHandler}
          onProgress={onProgressHandler}
          style={animatedImageStyle}
          {...rest}
        />
      )}
      {isError && showErrorIndicator && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={reloadImage}
          style={styles.errorIndicatorContainer}
        >
          <RNImage
            style={styles.errorIndicatorImage}
            source={{
              uri: 'https://qimg.xiaohongshu.com/beerdemo/56784f5477b2ee1ae776d96d7064ff0ce27001ab',
            }}
          />
        </TouchableOpacity>
      )}
      {/* {showProgressIndicator && (
        <View style={styles.errorIndicatorContainer}>
          <Progress percentage={progress} diam={44} />
        </View>
      )}
      {isTestEnv && (
        <View style={styles.testView}>
          <Text style={styles.testText}>{`${viewable}`}</Text>
          <Text style={styles.testText}>{`${imageViewable}`}</Text>
        </View>
      )} */}
    </View>
  );
};

/**
 * 图片
 * @see https://fe-docs.devops.xiaohongshu.com/reds-spectrum/components/Image
 * @param props `SpectrumImageProps`
 * @returns `React.ForwardRefRenderFunction<View, SpectrumImageProps>`
 */
export default memo(forwardRef(Image));

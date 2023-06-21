import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  image: {},
  errorIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIndicatorImage: {
    width: 44,
    height: 44,
  },
  testView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  testText: {
    color: 'red',
    fontWeight: '500',
  },
});

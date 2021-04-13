import * as React from 'react';
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
} from 'react-native';
const {width, height} = Dimensions.get('screen');

const API_KEY = '563492ad6f9170000100000130ab271c485b4901ab108e57b18d1daf';
const API_URL =
  'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20';
const IMAGE_SIZE = 80;
const SPACING = 10;

const fatchImagesFromPexels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });
  const {photos} = await data.json();
  return photos;
};

export default () => {
  const [images, setImages] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    const fetchImages = async () => {
      const img = await fatchImagesFromPexels();
      setImages(img);
    };
    fetchImages();
  }, []);
  const topRef = React.useRef();
  const tumbRef = React.useRef();
  const scrollToActiveIndex = index => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      tumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      tumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  // console.log(images);
  if (!images) {
    return <Text>Loading ...</Text>;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <StatusBar hidden />
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev =>
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width),
          )
        }
        renderItem={({item}) => {
          console.log(item.src.portrait);
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={tumbRef}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{position: 'absolute', bottom: IMAGE_SIZE}}
        contentContainerStyle={{paddingHorizontal: SPACING}}
        renderItem={({item, index}) => {
          console.log(item.src.portrait);
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? '#fff' : 'transparent',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

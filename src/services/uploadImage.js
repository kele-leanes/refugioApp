import ImagePicker from 'react-native-image-crop-picker';

export async function uploadImage() {
  const image = await ImagePicker.openPicker({
    width: 400,
    height: 400,
    cropping: true,
    includeBase64: true,
  });
  return image.data;
}

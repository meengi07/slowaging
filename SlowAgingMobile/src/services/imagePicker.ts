import {Alert, Linking, Platform} from 'react-native';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

type PickerSource = 'camera' | 'library';

export type ImagePickerResult =
  | {type: 'success'; asset: Asset}
  | {type: 'cancel'}
  | {type: 'error'; message: string};

export type ImagePickerConfig = {
  mediaType?: MediaType;
  quality?: PhotoQuality;
  includeBase64?: boolean;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
};

const defaultLibraryOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

const defaultCameraOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
  saveToPhotos: false,
};

async function ensurePermissions(_source: PickerSource): Promise<boolean> {
  if (Platform.OS === 'android') {
    return true;
  }

  // For iOS, react-native-image-picker handles permissions automatically.
  // We return true here but can extend later if manual permission checks are required.
  return true;
}

function handlePickerResponse(response: any): ImagePickerResult {
  if (response?.didCancel) {
    return {type: 'cancel'};
  }

  if (response?.errorCode || response?.errorMessage) {
    return {
      type: 'error',
      message: response.errorMessage || `Image picker error: ${response.errorCode}`,
    };
  }

  if (response?.assets && response.assets.length > 0) {
    return {type: 'success', asset: response.assets[0]};
  }

  return {type: 'error', message: 'No image selected. Please try again.'};
}

function showPermissionAlert(source: PickerSource) {
  const permissionName = source === 'camera' ? 'Camera' : 'Photo Library';
  Alert.alert(
    `${permissionName} Permission Required`,
    `Please enable ${permissionName.toLowerCase()} access in settings to continue.`,
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () => {
          Linking.openSettings().catch(() => {
            /* no-op */
          });
        },
      },
    ],
  );
}

export async function pickImageFromLibrary(
  config: ImagePickerConfig = {},
): Promise<ImagePickerResult> {
  const hasPermission = await ensurePermissions('library');
  if (!hasPermission) {
    showPermissionAlert('library');
    return {type: 'cancel'};
  }

  const response = await launchImageLibrary({
    ...defaultLibraryOptions,
    ...config,
  });
  return handlePickerResponse(response);
}

export async function captureImageWithCamera(
  config: ImagePickerConfig = {},
): Promise<ImagePickerResult> {
  const hasPermission = await ensurePermissions('camera');
  if (!hasPermission) {
    showPermissionAlert('camera');
    return {type: 'cancel'};
  }

  const response = await launchCamera({
    ...defaultCameraOptions,
    ...config,
  });
  return handlePickerResponse(response);
}

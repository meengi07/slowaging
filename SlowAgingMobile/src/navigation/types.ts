export type RootStackParamList = {
  Home: undefined;
  Details: {message?: string} | undefined;
};

export type ScreenName = keyof RootStackParamList;

export type RootStackParams<T extends ScreenName> = RootStackParamList[T];

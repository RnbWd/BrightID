// @flow

import nacl from 'tweetnacl';
import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import { names } from '../utils/fakeNames';
import api from '../Api/BrightId';
import { setConnectUserData } from './index';
import { strToUint8Array, uInt8ArrayToB64 } from '../utils/encoding';

export const addConnection = (navigation: () => null) => async (
  dispatch: dispatch,
  getState: getState,
) => {
  const { publicKey, secretKey } = nacl.sign.keyPair();
  const { main } = getState();
  const b64PubKey = uInt8ArrayToB64(publicKey);
  await api.createUser(b64PubKey);
  const { firstName, lastName } = names[
    Math.floor(Math.random() * (names.length - 1))
    ];
  const name = `${firstName} ${lastName}`;
  const score = Math.floor(Math.random() * 99);
  const timestamp = Date.now();
  const base64Key = uInt8ArrayToB64(publicKey);
  const message = base64Key + main.publicKey + timestamp;
  const signedMessage = uInt8ArrayToB64(
    nacl.sign.detached(strToUint8Array(message), secretKey),
  );

  const userData = {
    publicKey: b64PubKey,
    timestamp,
    secretKey,
    signedMessage,
    name,
    score,
    photo: 'https://loremflickr.com/180/180/all',
  };

  RNFetchBlob.fetch('GET', 'https://loremflickr.com/180/180/all', {})
    .then((res) => {
      if (res.info().status === 200) {
        userData.photo = `data:image/jpeg;base64,${String(res.base64())}`;
        dispatch(setConnectUserData(userData));
        navigation.navigate('PreviewConnection');
      } else {
        Alert.alert('Error', 'Unable to fetch image');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

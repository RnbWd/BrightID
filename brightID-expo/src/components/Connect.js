// @flow

import * as React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import NearbyAvatar from './NearbyAvatar';
import { refreshNearbyPeople } from '../actions';
import { Camera, BarCodeScanner, Permissions } from 'expo';

type Props = {
  nearbyPeople: Array<{
    avatarUri: string,
    name: string,
  }>,
  dispatch: () => void,
  navigation: { navigate: Function },
};

type State = {
  hasCameraPermission: boolean,
  scanBarcode: boolean,
  type: string,
};
class Connect extends React.Component<Props, State> {
  componentDidMount() {
    let nearbyPeopleArray = [{ name: 'Ron Paul', avatarUri: '' }];
    setInterval(() => {
      this.props.dispatch(refreshNearbyPeople(nearbyPeopleArray));
      if (nearbyPeopleArray.length === 1) nearbyPeopleArray = [];
      else nearbyPeopleArray = [{ name: 'Ron Paul', avatarUri: '' }];
    }, 8000);
  }
  genLines() {
    const lineCount = 6;
    const sep = 138 / lineCount;
  }

  renderConnect = () => {
    const { nearbyPeople } = this.props;
    // render the qr code buttons for now
    if (true) {
      return (
        <View style={styles.qrCodeButtonContainer}>
          {/* <TouchableOpacity>
            <Text>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Display QR Code</Text>
          </TouchableOpacity> */}
          <Button
            onPress={() => {
              this.props.navigation.navigate('BarcodeScanner');
            }}
            title="Scan"
            color="#4990e2"
            accessibilityLabel="Open camera to scan barcode"
          />
          <Button
            onPress={() => console.warn('pressed')}
            title="Display"
            color="#4990e2"
            accessibilityLabel="Display QR Code"
          />
        </View>
      );
    }
    if (nearbyPeople.length === 0) {
      return (
        <View style={styles.defaultOrb}>
          <Text style={styles.connectText}>CONNECT</Text>
        </View>
      );
    }
    return nearbyPeople.map((person, index) => (
      <View key={index} style={styles.nearbyPeopleContainer}>
        <Text style={styles.nearbyText}>NEARBY PEOPLE</Text>
        <NearbyAvatar avatarUri={person.avatarUri} />
        <Text style={styles.connectText}>{person.name}</Text>
      </View>
    ));
  };
  render() {
    // array of nearby people (determined by NFC?)
    // render default Orb is there are no nearby people
    // render nearby people if someone is nearby
    return (
      <View style={styles.connectContainer}>
        <View>{this.renderConnect()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  connectContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginTop: 17,
  },
  qrCodeButtonContainer: {
    flexDirection: 'row',
  },
  defaultOrb: {
    width: 138,
    height: 138,
    borderColor: '#fff893',
    borderWidth: 17,
    borderRadius: 69,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 20 },
    shadowRadius: 20,
    elevation: 1,
  },
  connectText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 16,
  },
  nearbyPeopleContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 14,
  },
  line: {
    width: 1,
    height: 17,
    backgroundColor: '#000',
    zIndex: 6,
    top: -17,
    position: 'absolute',
    transform: [{ skewX: '-5deg' }],
  },
});

export default connect((state) => state.main)(Connect);

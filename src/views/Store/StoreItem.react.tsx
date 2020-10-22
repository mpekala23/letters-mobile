import { AsyncImage, Button } from '@components';
import { popupAlert } from '@components/Alert/Alert.react';
import i18n from '@i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Typography } from '@styles';
import { PacketDesign } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Styles from './StoreItem.styles';

type StoreItemScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.StoreItem
>;

interface Props {
  coins: number;
  navigation: StoreItemScreenNavigationProp;
  route: { params: { item: PacketDesign } };
}

const StoreItemBase: React.FC<Props> = ({
  coins,
  route,
  navigation,
}: Props) => {
  const { item } = route.params;

  const initiatePurchase = () => {
    //   TODO: if we dont have enough coins display modal
    // if (!coins) {
    //   popupAlert({
    //     title: i18n.t('Compose.uploadAnImage'),
    //     buttons: [
    //       {
    //         text: i18n.t('Compose.takePhoto'),
    //         onPress: async () => {},
    //       },
    //       {
    //         text: i18n.t('Compose.uploadExistingPhoto'),
    //         reverse: true,
    //         onPress: async () => {},
    //       },
    //     ],
    //   });
    // }
  };
  return (
    <View style={Styles.trueBackground}>
      <Text style={Typography.FONT_BOLD}>{item.name}</Text>
      <AsyncImage
        download
        source={item.thumbnail}
        autorotate={false}
        viewStyle={{ width: '100%', height: '100%' }}
      />
      <Button
        reverse
        buttonText={i18n.t('StoreItem.viewBtn')}
        onPress={() => {
          navigation.navigate(Screens.StoreItemPreview, { uri: item.asset });
        }}
      />
      <Text style={Typography.FONT_BOLD}>
        {i18n.t('StoreItem.description')}
      </Text>
      <Button
        buttonText={i18n.t('StoreItem.viewBtn')}
        onPress={initiatePurchase}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    coins: state.user.user.coins,
  };
};

const StoreItemScreen = connect(mapStateToProps)(StoreItemBase);

export default StoreItemScreen;

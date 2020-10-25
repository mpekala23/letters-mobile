import { ContactSelectorCard } from '@components';
import { setProfileOverride } from '@components/Topbar';
import i18n from '@i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Contact, MailTypes, PremadeDesign } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React, { Dispatch, useEffect, useState } from 'react';
import { View, Text, Linking } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import CardStyles from '@components/Card/Card.styles';
import { createMail } from '@api';
import { popupAlert } from '@components/Alert/Alert.react';
import { Typography } from '@styles';
import { UserActionTypes } from '@store/User/UserTypes';
import { deductPremiumCoins } from '@store/User/UserActions';

type SelectPostcardSizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.SelectPostcardSize
>;

interface Props {
  contacts: Contact[];
  navigation: SelectPostcardSizeScreenNavigationProp;
  route: { params: { item: PremadeDesign } };
  deduct: (coins: number) => void;
}

const SelectRecipientBase = ({
  contacts,
  navigation,
  route,
  deduct,
}: Props) => {
  const [recipient, setRecipient] = useState<Contact>();

  const confirmPurchase = async () => {
    const { item } = route.params;
    if (!recipient) return;

    popupAlert({
      title: i18n.t('SelectRecipient.modalHeader'),
      message: i18n.t('SelectRecipient.modalMessage'),
      buttons: [
        {
          text: i18n.t('SelectRecipient.confirm'),
          onPress: async () => {
            try {
              await createMail(
                {
                  type: MailTypes.Letter,
                  recipientId: recipient.id,
                  content: '',
                  images: [],
                  pdf: item.asset.uri,
                },
                item.productId
              );
              deduct(item.price);
              setProfileOverride(undefined);
              navigation.reset({
                index: 0,
                routes: [{ name: Screens.StoreItemPurchaseSuccess }],
              });
            } catch (err) {
              popupAlert({
                title: i18n.t('Error.cantSendMailModalTitle'),
                message: i18n.t('Error.cantSendMailModalBody'),
                buttons: [
                  {
                    text: i18n.t('Error.reachOutToSupport'),
                    onPress: async () => {
                      await Linking.openURL('https://m.me/teamameelio');
                    },
                  },
                  {
                    text: i18n.t('Error.noThanks'),
                    reverse: true,
                  },
                ],
              });
            }
          },
        },
        {
          text: i18n.t('SelectRecipient.cancel'),
          reverse: true,
        },
      ],
    });
  };

  useEffect(() => {
    setProfileOverride({
      enabled: !!recipient,
      text: i18n.t('Compose.selectBtn'),
      action: confirmPurchase,
      blocking: true,
    });

    return () => {
      setProfileOverride(undefined);
    };
  }, [recipient]);

  const renderItem = ({
    item,
  }: {
    item: Contact;
    index: number;
  }): JSX.Element => {
    return (
      <ContactSelectorCard
        style={
          item.id === recipient?.id ? CardStyles.cardSelectedBackground : {}
        }
        firstName={item.firstName}
        lastName={item.lastName}
        imageUri={item.image?.uri}
        numSent={item.totalSent}
        onPress={() => setRecipient(item)}
        contactPostal={item.facility.postal}
        key={`${item.inmateNumber}-${item.lastName}-${item.lastName}-${item.id}-${item.backgroundColor}`}
        backgroundColor={item.backgroundColor}
        isLoadingMail={false}
      />
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={[Typography.FONT_BOLD, { fontSize: 18, marginBottom: 8 }]}>
        {i18n.t('SelectRecipient.header')}
      </Text>
      <FlatList
        key={`Flatlist${contacts.length}`}
        data={contacts}
        renderItem={renderItem}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        numColumns={contacts.length > 1 ? 2 : 1}
        keyExtractor={(item) => item.inmateNumber.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  contacts: state.contact.existing,
});

const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) => {
  return {
    deduct: (coins: number) => dispatch(deductPremiumCoins(coins)),
  };
};

const SelectRecipientScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectRecipientBase);
export default SelectRecipientScreen;

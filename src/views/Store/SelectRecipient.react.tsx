import { ContactSelectorCard } from '@components';
import { setProfileOverride } from '@components/Topbar';
import i18n from '@i18n';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Contact, MailTypes, PremadeDesign } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React, { useEffect, useState } from 'react';
import { View, Text, Linking } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import CardStyles from '@components/Card/Card.styles';
import { createMail } from '@api';
import { popupAlert } from '@components/Alert/Alert.react';
import { Typography } from '@styles';

type SelectPostcardSizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.SelectRecipient
>;

interface Props {
  contacts: Contact[];
  navigation: SelectPostcardSizeScreenNavigationProp;
  route: { params: { item: PremadeDesign } };
}

const SelectRecipientBase = ({ contacts, navigation, route }: Props) => {
  const [recipient, setRecipient] = useState<Contact>();

  const confirmPurchase = async () => {
    const { item } = route.params;
    if (!recipient) return;
    try {
      await createMail(
        {
          type: MailTypes.Packet,
          recipientId: recipient.id,
          content: '',
          asset: item.asset.uri,
        },
        item.productId
      );
      setProfileOverride(undefined);
      navigation.navigate(Screens.Store);
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
        numColumns={1}
        keyExtractor={(item) => item.inmateNumber.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  contacts: state.contact.existing,
});
const SelectRecipientScreen = connect(mapStateToProps)(SelectRecipientBase);
export default SelectRecipientScreen;

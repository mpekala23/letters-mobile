import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { PrisonTypes } from 'types';
import i18n from '@i18n';
import CardStyles from './Card.styles';

interface Props {
  name: string;
  type: PrisonTypes;
  address: string;
  onPress: () => void;
  style?: ViewStyle;
}

const PrisonCard: React.FC<Props> = (props: Props) => {
  const getFacilityTypeLabel = (): string => {
    switch (props.type) {
      case PrisonTypes.State:
        return i18n.t('PrisonTypes.state');
      case PrisonTypes.Federal:
        return i18n.t('PrisonTypes.federal');
      case PrisonTypes.County:
        return i18n.t('PrisonTypes.county');
      case PrisonTypes.Immigration:
        return i18n.t('PrisonTypes.immigration');
      default:
        return '';
    }
  };
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
    >
      <Text style={CardStyles.cardTitle}>{props.name}</Text>
      <Text style={[CardStyles.cardData, { marginVertical: 6 }]}>
        {getFacilityTypeLabel()}
      </Text>
      <Text style={CardStyles.cardData}>{props.address}</Text>
    </TouchableOpacity>
  );
};

PrisonCard.defaultProps = {
  style: {},
};

export default PrisonCard;

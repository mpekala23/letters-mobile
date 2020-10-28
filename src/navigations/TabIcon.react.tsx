import { Icon } from '@components';
import { Tabs } from '@utils/Screens';
import React from 'react';
import ActiveHome from '@assets/navigation/ActiveHome';
import ActiveStore from '@assets/navigation/ActiveStore';
import Home from '@assets/navigation/Home';
import Store from '@assets/navigation/Store';

interface Props {
  name: string;
  active: boolean;
}

const TabIcon: React.FC<Props> = ({ name, active }: Props) => {
  let icon: string;
  if (name === Tabs.Store) {
    icon = active ? ActiveStore : Store;
  } else {
    icon = active ? ActiveHome : Home;
  }
  return <Icon svg={icon} />;
};

export default TabIcon;

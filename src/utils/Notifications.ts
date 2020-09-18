import * as Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { deleteDraft } from '@api/User';
import i18n from '@i18n';
import { Contact } from 'types';
import { addDays, format } from 'date-fns';

export function handleNotificationsAfterSend(activeContact: Contact): void {
  Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
  Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
  Notifs.scheduleNotificationInDays(
    {
      title: `${i18n.t('Notifs.happy')} ${format(
        addDays(new Date(), 7),
        'dddd'
      )}! ${i18n.t('Notifs.readyToSendAnother')} ${activeContact.firstName}?`,
      body: `${i18n.t('Notifs.clickHereToBegin')}`,
      type: NotifTypes.Drought,
      data: {
        contactId: activeContact.id,
      },
    },
    7
  );
}

export function cleanupAfterSend(activeContact: Contact): void {
  handleNotificationsAfterSend(activeContact);
  deleteDraft();
}

import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { deleteDraft, deleteDraft } from '@api/User';
import i18n from '@i18n';
import { hoursTill8Tomorrow } from '@utils';
import { Contact } from 'types';

export default function cancelNotifications(activeContact: Contact): void {
  Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
  Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
  Notifs.scheduleNotificationInDays(
    {
      title: `${i18n.t('Notifs.happy')} ${new Date().toDateString()}! ${i18n.t(
        'Notifs.readyToSendAnother'
      )} ${activeContact.firstName}?`,
      body: `${i18n.t('Notifs.clickHereToBegin')}`,
      data: {
        type: NotifTypes.Drought,
        data: {
          contactId: activeContact.id,
        },
      },
    },
    hoursTill8Tomorrow() / 24 + 7
  );
  deleteDraft();
}

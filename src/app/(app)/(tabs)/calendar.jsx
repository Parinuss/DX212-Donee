import React from 'react';
import { useDonee } from '../../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, renderCalendar } = useDonee();
  return <ScreenFrame>{renderCalendar()}</ScreenFrame>;
}

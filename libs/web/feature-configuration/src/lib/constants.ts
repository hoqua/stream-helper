import { ModeEnum, ModeType } from '@durablr/shared-utils-schemas';
export const ModeOptions: Record<ModeType, string> = {
  [ModeEnum.enum.realtime]: 'Real-time',
  [ModeEnum.enum.batch]: 'Batch (every hour)',
  [ModeEnum.enum.daily]: 'Daily',
};

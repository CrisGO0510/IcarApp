export const ACTION_KIND = {
  DELETE: 'delete',
  CANCEL: 'cancel',
} as const;

export type ActionKind = (typeof ACTION_KIND)[keyof typeof ACTION_KIND];

export const ACTION_COLOR = 'negative';
export const DELETE_ICON = 'delete';

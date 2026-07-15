import { useQuasar } from 'quasar';

export const CONFIRM_CANCEL_LABEL = 'Cancelar';
export const CONFIRM_DELETE_LABEL = 'Eliminar';
const CONFIRM_OK_COLOR = 'negative';

export interface ConfirmDestructiveOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function useConfirmDialog() {
  const $q = useQuasar();

  function confirmDestructive(options: ConfirmDestructiveOptions): void {
    $q.dialog({
      title: options.title,
      message: options.message,
      cancel: { flat: true, noCaps: true, label: CONFIRM_CANCEL_LABEL },
      ok: {
        unelevated: true,
        noCaps: true,
        color: CONFIRM_OK_COLOR,
        label: options.confirmLabel ?? CONFIRM_DELETE_LABEL,
      },
      dark: true,
    }).onOk(options.onConfirm);
  }

  return { confirmDestructive };
}

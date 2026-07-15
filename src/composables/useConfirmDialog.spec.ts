import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useConfirmDialog,
  CONFIRM_CANCEL_LABEL,
  CONFIRM_DELETE_LABEL,
} from './useConfirmDialog';

const { dialogMock, onOkMock } = vi.hoisted(() => {
  const onOkMock = vi.fn();
  return {
    onOkMock,
    dialogMock: vi.fn(() => ({ onOk: onOkMock })),
  };
});

vi.mock('quasar', () => ({
  useQuasar: () => ({ dialog: dialogMock }),
}));

describe('useConfirmDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens a destructive dialog with the standard styles', () => {
    // Arrange
    const { confirmDestructive } = useConfirmDialog();

    // Act
    confirmDestructive({ title: 'Eliminar comida', message: '¿Seguro?', onConfirm: () => {} });

    // Assert
    expect(dialogMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Eliminar comida',
        message: '¿Seguro?',
        dark: true,
        cancel: expect.objectContaining({ flat: true, noCaps: true, label: CONFIRM_CANCEL_LABEL }),
        ok: expect.objectContaining({
          unelevated: true,
          noCaps: true,
          color: 'negative',
          label: CONFIRM_DELETE_LABEL,
        }),
      }),
    );
  });

  it('uses a custom confirm label when provided', () => {
    // Arrange
    const { confirmDestructive } = useConfirmDialog();

    // Act
    confirmDestructive({
      title: 'Importar datos',
      message: '…',
      confirmLabel: 'Reemplazar',
      onConfirm: () => {},
    });

    // Assert
    expect(dialogMock).toHaveBeenCalledWith(
      expect.objectContaining({ ok: expect.objectContaining({ label: 'Reemplazar' }) }),
    );
  });

  it('runs onConfirm only when the dialog is confirmed', () => {
    // Arrange
    const { confirmDestructive } = useConfirmDialog();
    const onConfirm = vi.fn();

    // Act
    confirmDestructive({ title: 'x', message: 'y', onConfirm });
    const registeredCallback = onOkMock.mock.calls[0]?.[0] as () => void;

    // Assert
    expect(onConfirm).not.toHaveBeenCalled();
    registeredCallback();
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

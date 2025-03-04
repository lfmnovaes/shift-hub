import { useRef } from 'react';

export enum ModalType {
  WITHDRAW = 'withdraw',
  ALREADY_APPLIED = 'already-applied',
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: ModalType;
}

const modalConfig = {
  [ModalType.WITHDRAW]: {
    title: 'Withdraw Application',
    content: 'Are you sure you want to withdraw your application for this shift?',
    buttons: [
      { label: 'Cancel', action: 'close', variant: 'btn' },
      { label: 'Confirm', action: 'confirm', variant: 'btn-primary' },
    ],
  },
  [ModalType.ALREADY_APPLIED]: {
    title: 'Already Applied',
    content:
      'You already have an active shift application. You must withdraw from your current shift before applying to a new one.',
    buttons: [{ label: 'Understood', action: 'close', variant: 'btn-primary' }],
  },
};

export function Modal({ isOpen, onClose, onConfirm, type }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  if (!isOpen) return null;

  const config = modalConfig[type];

  const handleButtonClick = (action: string) => {
    if (action === 'close') {
      onClose();
    } else if (action === 'confirm' && onConfirm) {
      onConfirm();
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">{config.title}</h3>
        <p>{config.content}</p>
        <div className="modal-action">
          {config.buttons.map((button, index) => (
            <button
              key={index}
              className={`btn ${button.variant}`}
              onClick={() => handleButtonClick(button.action)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}

export function WithdrawModal({ isOpen, onClose, onConfirm }: Omit<ModalProps, 'type'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} type={ModalType.WITHDRAW} />
  );
}

export function AlreadyAppliedModal({ isOpen, onClose }: Omit<ModalProps, 'type' | 'onConfirm'>) {
  return <Modal isOpen={isOpen} onClose={onClose} type={ModalType.ALREADY_APPLIED} />;
}

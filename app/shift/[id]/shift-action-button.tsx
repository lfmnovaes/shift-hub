'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal, ModalType } from './modals';

interface ShiftActionButtonProps {
  shiftId: number;
  isApplied: boolean;
  isOccupied: boolean;
  userId?: number;
}

export default function ShiftActionButton({
  shiftId,
  isApplied: initialIsApplied,
  isOccupied: initialIsOccupied,
  userId,
}: ShiftActionButtonProps) {
  const [isApplied, setIsApplied] = useState(initialIsApplied);
  const [isOccupied, setIsOccupied] = useState(initialIsOccupied);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Check if user already has a shift
      const userShiftsResponse = await fetch('/api/shifts/user-shifts');
      const userShiftsData = await userShiftsResponse.json();

      if (userShiftsResponse.ok && userShiftsData.shifts && userShiftsData.shifts.length > 0) {
        setShowAlreadyAppliedModal(true);
        setLoading(false);
        return;
      }
      setIsApplied(true);
      setIsOccupied(true);

      const response = await fetch(`/api/shifts/${shiftId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully applied to shift!');
      } else {
        // Revert UI changes if the server request failed
        setIsApplied(false);
        setIsOccupied(initialIsOccupied);
        toast.error(data.error || 'Failed to apply to shift. Please try again.');
      }
    } catch (error) {
      // Revert UI changes if there was an error
      setIsApplied(false);
      setIsOccupied(initialIsOccupied);
      toast.error('Failed to apply to shift. Please try again.');
      console.error('Error applying to shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      setIsApplied(false);
      setIsOccupied(false);
      setShowWithdrawModal(false);

      const response = await fetch(`/api/shifts/${shiftId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully withdrew from shift!');
      } else {
        // Revert UI changes if the server request failed
        setIsApplied(true);
        setIsOccupied(true);
        toast.error(data.error || 'Failed to withdraw from shift. Please try again.');
      }
    } catch (error) {
      // Revert UI changes if there was an error
      setIsApplied(true);
      setIsOccupied(true);
      toast.error('Failed to withdraw from shift. Please try again.');
      console.error('Error withdrawing from shift:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isApplied) {
    return (
      <>
        <button
          className="btn btn-error"
          onClick={() => setShowWithdrawModal(true)}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onConfirm={handleWithdraw}
          type={ModalType.WITHDRAW}
        />
      </>
    );
  }

  return (
    <>
      <button className="btn btn-primary" onClick={handleApply} disabled={isOccupied || loading}>
        {loading ? 'Processing...' : isOccupied ? 'Occupied' : 'Apply'}
      </button>
      <Modal
        isOpen={showAlreadyAppliedModal}
        onClose={() => setShowAlreadyAppliedModal(false)}
        type={ModalType.ALREADY_APPLIED}
      />
    </>
  );
}

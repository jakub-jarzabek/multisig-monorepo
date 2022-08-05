import { useEffect } from 'react';

export const useSubscriveEvents = (callback: () => void, program) => {
  useEffect(() => {
    const listener_1 = program.addEventListener(
      'WalletCreatedEvent',
      (event, slot) => {
        callback();
      }
    );

    const listener_2 = program.addEventListener(
      'WalletOwnersSetEvent',
      (event, slot) => {
        callback();
      }
    );

    const listener_3 = program.addEventListener(
      'WalletThresholdSetEvent',
      (event, slot) => {
        callback();
      }
    );
    const listener_4 = program.addEventListener(
      'TransactionCreatedEvent',
      (event, slot) => {
        callback();
      }
    );
    const listener_5 = program.addEventListener(
      'ApprovedEvent',
      (event, slot) => {
        callback();
      }
    );
    const listener_6 = program.addEventListener(
      'DeletedEvent',
      (event, slot) => {
        callback();
      }
    );
    const listener_7 = program.addEventListener(
      'TransactionExecutedEvent',
      (event, slot) => {
        callback();
      }
    );
    return () => {
      program.removeEventListener(listener_1);
      program.removeEventListener(listener_2);
      program.removeEventListener(listener_3);
      program.removeEventListener(listener_4);
      program.removeEventListener(listener_5);
      program.removeEventListener(listener_6);
      program.removeEventListener(listener_7);
    };
  }, []);
};

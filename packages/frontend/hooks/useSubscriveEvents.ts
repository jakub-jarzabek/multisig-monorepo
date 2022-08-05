import { useEffect, useRef } from 'react';

export const useSubscriveEvents = (callback: () => void, program) => {
  const isListening = useRef(false);

  useEffect(() => {
    let listener_1,
      listener_2,
      listener_3,
      listener_4,
      listener_5,
      listener_6,
      listener_7;
    if (program && !isListening) {
      listener_1 = program.addEventListener(
        'WalletCreatedEvent',
        (event, slot) => {
          callback();
        }
      );

      listener_2 = program.addEventListener(
        'WalletOwnersSetEvent',
        (event, slot) => {
          callback();
        }
      );

      listener_3 = program.addEventListener(
        'WalletThresholdSetEvent',
        (event, slot) => {
          callback();
        }
      );
      listener_4 = program.addEventListener(
        'TransactionCreatedEvent',
        (event, slot) => {
          callback();
        }
      );
      listener_5 = program.addEventListener('ApprovedEvent', (event, slot) => {
        callback();
      });
      listener_6 = program.addEventListener('DeletedEvent', (event, slot) => {
        callback();
      });
      listener_7 = program.addEventListener(
        'TransactionExecutedEvent',
        (event, slot) => {
          callback();
        }
      );
      isListening.current = true;
      return () => {
        program.removeEventListener(listener_1);
        program.removeEventListener(listener_2);
        program.removeEventListener(listener_3);
        program.removeEventListener(listener_4);
        program.removeEventListener(listener_5);
        program.removeEventListener(listener_6);
        program.removeEventListener(listener_7);
      };
    }
  }, [program]);
};

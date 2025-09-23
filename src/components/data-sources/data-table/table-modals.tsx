"use client";

import { ScheduleAutoResetModal } from "@/components/popup/autoResetSchedule";
import { ImportDataModal } from "@/components/popup/importDataModel";

export function TableModals({
  autoResetOpen,
  importOpen,
  onCloseAutoReset,
  onCloseImport,
  onImport,
}: {
  autoResetOpen: boolean;
  importOpen: boolean;
  onCloseAutoReset: () => void;
  onCloseImport: () => void;
  onImport: (file: File, method: string) => void;
}) {
  return (
    <>
      <ScheduleAutoResetModal
        isOpen={autoResetOpen}
        onClose={onCloseAutoReset}
      />
      <ImportDataModal
        isOpen={importOpen}
        onClose={onCloseImport}
        onImport={onImport}
      />
    </>
  );
}

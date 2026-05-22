type MachineSheetToggleButtonProps = {
  readonly label: string;
  readonly expanded: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export const MACHINE_SHEET_TOGGLE_BUTTON_CLASS =
  "inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#18181b] bg-[#09090b] px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:border-[#2a2a2f] hover:brightness-110";

export function MachineSheetToggleButton({ label, expanded, onClick, className }: MachineSheetToggleButtonProps) {
  return (
    <button
      aria-expanded={expanded}
      className={className ? `${MACHINE_SHEET_TOGGLE_BUTTON_CLASS} ${className}` : MACHINE_SHEET_TOGGLE_BUTTON_CLASS}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

import NewModal from "./NewModal";

interface ActionsProps {
  onGoBack: () => void;
  disableGoBack: boolean;
}

export default function Actions({ onGoBack, disableGoBack }: ActionsProps) {
  return (
    <div>
      <button onClick={onGoBack} disabled={disableGoBack}>
        Go Back
      </button>
      <NewModal></NewModal>
    </div>
  );
}

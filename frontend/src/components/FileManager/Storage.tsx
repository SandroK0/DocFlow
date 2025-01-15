import { useFileManager } from "./useFileManager";
export default function Storage() {
  const { storageState } = useFileManager();

  return (
    <div>
      {storageState?.used}/ {storageState?.total}
    </div>
  );
}

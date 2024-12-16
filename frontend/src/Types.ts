export interface Document {
  id: number;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  folder_id: number | null;
}

export interface Folder {
  id: number;
  name: string;
}

export interface Document {
  id: number;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  folder_id: number | null;
}

export interface Subfolder {
  id: number;
  name: string;
  is_empty: boolean;
}

export interface Folder {
  id: number;
  name: string;
  is_empty: boolean;
  user_id: number;
  parent_id: number;
  subfolders: Subfolder[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

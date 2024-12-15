// content: "<p>Hello, World!</p>"
// ​
// created_at: "Sat, 14 Dec 2024 19:46:16 GMT"
// ​
// id: 15
// ​
// title: "test_title"
// ​
// updated_at: "Sat, 14 Dec 2024 19:46:16 GMT"

export interface Document {
  id: number;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  folder_id: number | null;
}

export interface Folder {}

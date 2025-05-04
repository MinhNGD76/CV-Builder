export interface Block {
  id: string;
  type?: string;
  content?: string;
  [key: string]: any;
} 
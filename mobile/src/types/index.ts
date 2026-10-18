// mobile/src/types/index.ts

export interface Category {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: number;
  chapters_count?: number;
}

export interface Chapter {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  chapter_number: number;
  display_order: number;
  is_published: number;
  category_title?: string;
  subtopics_count?: number;
}

export interface Subtopic {
  id: number;
  chapter_id: number;
  title: string;
  description: string | null;
  display_order: number;
  is_published: number;
  chapter_title?: string;
  category_id?: number;
  document_id?: number | null;
  document_title?: string | null;
  document_file_size?: number | null;
  document_allow_download?: number | null;
  has_document?: number;
}

export interface Document {
  id: number;
  subtopic_id: number;
  title: string;
  storage_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  is_published: number;
  allow_download: number;
  subtopic_title?: string;
  chapter_title?: string;
  category_title?: string;
}

export interface AppSettings {
  app_title: string;
  app_subtitle?: string;
  primary_wood_color?: string;
  accent_color?: string;
  text_color?: string;
  background_image?: string;
  footer_credit?: string;
}

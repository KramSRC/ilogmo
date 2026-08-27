/**
 * iLogMo - Document Zustand Store
 * Client-side cached state for document list and operations.
 */

import { create } from 'zustand';
import { Document } from '@/features/documents/types';

export interface DocumentStoreState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearDocuments: () => void;
}

export const useDocumentStore = create<DocumentStoreState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,

  setDocuments: (documents) =>
    set({
      documents,
      isLoading: false,
      error: null,
    }),

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents.filter((d) => d.id !== document.id)],
    })),

  updateDocument: (document) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === document.id ? document : d)),
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearDocuments: () =>
    set({
      documents: [],
      isLoading: false,
      error: null,
    }),
}));

export default useDocumentStore;

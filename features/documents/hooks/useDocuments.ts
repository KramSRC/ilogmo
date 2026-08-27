/**
 * iLogMo - useDocuments Hook
 * Provides document state, category filtering, search, upload orchestration, open file, and delete handlers.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { useAuthStore, useDocumentStore } from '@/store';
import { documentService } from '../services';
import { Document, DocumentFilterCategory, DocumentFormData, DocumentActionResult } from '../types';

export function useDocuments() {
  const { user } = useAuthStore();
  const {
    documents,
    isLoading: storeLoading,
    error: storeError,
    setDocuments,
    addDocument,
    removeDocument,
    setLoading,
    setError,
  } = useDocumentStore();

  const [selectedCategory, setSelectedCategory] = useState<DocumentFilterCategory>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Load all documents for the current user.
   */
  const loadDocuments = useCallback(
    async (showLoadingSpinner: boolean = true) => {
      if (!user?.id) return;

      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await documentService.getDocuments(user.id);
        setDocuments(data);
      } catch (err: any) {
        console.warn('[useDocuments.loadDocuments] Error:', err);
        setError('Unable to load your documents. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [user, setLoading, setError, setDocuments]
  );

  // Initial load when user is authenticated
  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user, loadDocuments]);

  /**
   * Pull-to-refresh handler.
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadDocuments(false);
    setIsRefreshing(false);
  }, [loadDocuments]);

  /**
   * Upload a new document with optimistic update.
   */
  const uploadDocument = useCallback(
    async (formData: DocumentFormData): Promise<DocumentActionResult<Document>> => {
      if (!user?.id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsUploading(true);
      try {
        const result = await documentService.createDocument(user.id, formData);
        if (result.success && result.data) {
          addDocument(result.data);
        }
        return result;
      } catch (err: any) {
        console.warn('[useDocuments.uploadDocument] Error:', err);
        return {
          success: false,
          error: err?.message || 'Unable to upload document. Please try again.',
        };
      } finally {
        setIsUploading(false);
      }
    },
    [user, addDocument]
  );

  /**
   * Generate signed URL and open document in system viewer or browser.
   */
  const openDocument = useCallback(async (doc: Document): Promise<boolean> => {
    if (!doc.storagePath) {
      Alert.alert('Error', 'Invalid file path for this document.');
      return false;
    }

    try {
      const signedUrl = await documentService.getSignedUrl(doc.storagePath, 300); // 5-minute validity
      if (!signedUrl) {
        Alert.alert('Error', 'Unable to generate secure download link for this document.');
        return false;
      }

      await Linking.openURL(signedUrl);
      return true;
    } catch (err) {
      console.warn('[useDocuments.openDocument] Error opening file:', err);
      Alert.alert('Error', 'Unable to open this document on your device.');
      return false;
    }
  }, []);

  /**
   * Delete a document with confirmation cleanup.
   */
  const deleteDocument = useCallback(
    async (id: string, storagePath: string): Promise<DocumentActionResult<boolean>> => {
      if (!user?.id || !id) {
        return { success: false, error: 'User is not authenticated.' };
      }

      setIsDeleting(true);
      try {
        const result = await documentService.deleteDocument(user.id, id, storagePath);
        if (result.success) {
          removeDocument(id);
        }
        return result;
      } catch (err: any) {
        console.warn('[useDocuments.deleteDocument] Error:', err);
        return {
          success: false,
          error: err?.message || 'Unable to delete document. Please try again.',
        };
      } finally {
        setIsDeleting(false);
      }
    },
    [user, removeDocument]
  );

  /**
   * Get single document by ID (from cache or DB).
   */
  const getDocumentById = useCallback(
    async (id: string): Promise<Document | null> => {
      const cached = documents.find((d) => d.id === id);
      if (cached) return cached;

      if (!user?.id) return null;
      return await documentService.getDocumentById(user.id, id);
    },
    [documents, user]
  );

  /**
   * Filtered documents based on selected category.
   */
  const filteredDocuments = useMemo(() => {
    if (selectedCategory === 'all') {
      return documents;
    }
    return documents.filter((d) => d.category === selectedCategory);
  }, [documents, selectedCategory]);

  /**
   * Count map per category.
   */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length };
    documents.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [documents]);

  return {
    documents,
    filteredDocuments,
    selectedCategory,
    categoryCounts,
    isLoading: storeLoading,
    isRefreshing,
    isUploading,
    isDeleting,
    error: storeError,
    setSelectedCategory,
    loadDocuments,
    refresh,
    uploadDocument,
    openDocument,
    deleteDocument,
    getDocumentById,
  };
}

export default useDocuments;

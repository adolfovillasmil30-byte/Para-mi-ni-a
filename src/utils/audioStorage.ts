/**
 * IndexedDB storage for custom voice notes (.mp3, .m4a, .wav)
 * Prevents LocalStorage quota limits and persists permanently.
 */

const DB_NAME = 'RomanticVoiceNoteDB';
const DB_VERSION = 1;
const STORE_NAME = 'voice_notes';
const VOICE_KEY = 'mivi_secret_voice_note';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVoiceNoteAudio(file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putRequest = store.put(dataUrl, VOICE_KEY);
      putRequest.onsuccess = () => resolve(dataUrl);
      putRequest.onerror = () => reject(putRequest.error);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function getVoiceNoteAudio(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(VOICE_KEY);
      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };
      getRequest.onerror = () => resolve(null);
    });
  } catch (_) {
    return null;
  }
}

export async function removeVoiceNoteAudio(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(VOICE_KEY);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });
  } catch (_) {}
}

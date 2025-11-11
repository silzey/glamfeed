
import { db } from '@/lib/firebase/dataFirebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getUserCoinBalance(userId: string): Promise<number> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data?.coins || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching user coin balance:', error);
    return 0;
  }
}

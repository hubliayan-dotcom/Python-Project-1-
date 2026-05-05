import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  getDocs, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, Category, Budget, OperationType, FirestoreErrorInfo } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const TRANSACTIONS_COL = 'transactions';
const CATEGORIES_COL = 'categories';
const BUDGETS_COL = 'budgets';

export const expenseService = {
  // Transactions
  subscribeTransactions: (callback: (data: Transaction[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, TRANSACTIONS_COL), 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, TRANSACTIONS_COL);
    });
  },

  addTransaction: async (data: Omit<Transaction, 'id' | 'userId'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Not authenticated');

    try {
      const docRef = await addDoc(collection(db, TRANSACTIONS_COL), {
        ...data,
        userId,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, TRANSACTIONS_COL);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${TRANSACTIONS_COL}/${id}`);
    }
  },

  // Categories
  subscribeCategories: (callback: (data: Category[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, CATEGORIES_COL), where('userId', '==', userId));
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, CATEGORIES_COL);
    });
  },

  addCategory: async (data: Omit<Category, 'id' | 'userId'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Not authenticated');

    try {
      const docRef = await addDoc(collection(db, CATEGORIES_COL), {
        ...data,
        userId,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, CATEGORIES_COL);
    }
  },
  
  // Seed default categories if they don't exist
  seedDefaultCategories: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, CATEGORIES_COL), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const defaults = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Salary'];
      for (const name of defaults) {
        await expenseService.addCategory({ name });
      }
    }
  },

  // Budgets
  subscribeBudgets: (month: string, callback: (data: Budget[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, BUDGETS_COL), 
      where('userId', '==', userId),
      where('month', '==', month)
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, BUDGETS_COL);
    });
  },

  updateBudget: async (month: string, categoryId: string, amount: number) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Not authenticated');

    try {
      const q = query(
        collection(db, BUDGETS_COL), 
        where('userId', '==', userId),
        where('month', '==', month),
        where('categoryId', '==', categoryId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(collection(db, BUDGETS_COL), {
          userId,
          month,
          categoryId,
          amount,
        });
      } else {
        const id = snapshot.docs[0].id;
        await updateDoc(doc(db, BUDGETS_COL, id), { amount });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, BUDGETS_COL);
    }
  }
};

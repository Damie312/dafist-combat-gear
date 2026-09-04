import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider } from '../lib/firebase';
import { CustomerProfile } from '../types';

interface CustomerAuthContextType {
  customer: User | null;
  customerProfile: CustomerProfile | null;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => Promise<void>;
  clearError: () => void;
}

/**
 * Recursively removes all undefined properties from an object so Firestore does not throw:
 * "Unsupported field value: undefined"
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync profile from Firestore whenever authenticated customer changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setCustomer(currentUser);
      setAuthError(null);

      if (currentUser) {
        try {
          const profileDocRef = doc(db, 'customers', currentUser.uid);
          const profileSnap = await getDoc(profileDocRef);

          if (profileSnap.exists()) {
            const data = profileSnap.data() as CustomerProfile;
            setCustomerProfile(data);
          } else {
            // First-time sign in: Initialize profile preserving createdAt without undefined values
            const now = new Date().toISOString();
            const newProfile: CustomerProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Khách hàng',
              createdAt: now,
              updatedAt: now,
            };

            if (currentUser.photoURL) {
              newProfile.photoURL = currentUser.photoURL;
            }
            if (currentUser.phoneNumber) {
              newProfile.phoneNumber = currentUser.phoneNumber;
            }

            await setDoc(profileDocRef, sanitizeForFirestore(newProfile));
            setCustomerProfile(newProfile);
          }
        } catch (err: any) {
          console.error('Error fetching/initializing customer profile:', err);
          setAuthError('Không thể tải thông tin tài khoản khách hàng.');
        }
      } else {
        setCustomerProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const loggedUser = result.user;
      
      const profileDocRef = doc(db, 'customers', loggedUser.uid);
      const profileSnap = await getDoc(profileDocRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data() as CustomerProfile;
        setCustomerProfile(data);
      } else {
        // First-time sign in: Initialize profile safely without undefined fields
        const now = new Date().toISOString();
        const newProfile: CustomerProfile = {
          uid: loggedUser.uid,
          email: loggedUser.email || '',
          displayName: loggedUser.displayName || 'Khách hàng',
          createdAt: now,
          updatedAt: now,
        };

        if (loggedUser.photoURL) {
          newProfile.photoURL = loggedUser.photoURL;
        }
        if (loggedUser.phoneNumber) {
          newProfile.phoneNumber = loggedUser.phoneNumber;
        }

        await setDoc(profileDocRef, sanitizeForFirestore(newProfile));
        setCustomerProfile(newProfile);
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Customer Google sign-in failed:', err);
      let message = 'Đăng nhập Google thất bại. Vui lòng thử lại.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Trình duyệt đã chặn popup đăng nhập. Vui lòng cấp quyền mở popup.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setCustomer(null);
      setCustomerProfile(null);
      setAuthError(null);
    } catch (err: any) {
      console.error('Customer logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerProfile = async (data: Partial<CustomerProfile>): Promise<void> => {
    if (!customer) {
      throw new Error('Bạn cần đăng nhập để cập nhật hồ sơ.');
    }

    try {
      const profileDocRef = doc(db, 'customers', customer.uid);
      const updatedAt = new Date().toISOString();
      const payload = sanitizeForFirestore({
        ...data,
        uid: customer.uid, // Always preserve customer's own uid
        updatedAt
      });

      await updateDoc(profileDocRef, payload);

      setCustomerProfile(prev => prev ? {
        ...prev,
        ...payload
      } : null);
    } catch (err: any) {
      console.error('Failed to update customer profile:', err);
      throw err;
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerProfile,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        updateCustomerProfile,
        clearError,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

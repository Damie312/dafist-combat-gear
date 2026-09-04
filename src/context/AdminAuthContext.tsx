import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider } from '../lib/firebase';

export const MASTER_ADMIN_EMAIL = 'duyanh31203@gmail.com';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  authorizedAdminEmail: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setUser(currentUser);
      setAuthError(null);

      if (currentUser) {
        try {
          // Check 1: Master admin email match
          const isMasterEmail = currentUser.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

          // Check 2: Firestore admins collection by UID
          let hasUidAdminDoc = false;
          try {
            const uidDocSnap = await getDoc(doc(db, 'admins', currentUser.uid));
            hasUidAdminDoc = uidDocSnap.exists();
          } catch {
            hasUidAdminDoc = false;
          }

          // Check 3: Firestore admins collection by Email
          let hasEmailAdminDoc = false;
          if (currentUser.email) {
            try {
              const emailDocSnap = await getDoc(doc(db, 'admins', currentUser.email.toLowerCase()));
              hasEmailAdminDoc = emailDocSnap.exists();
            } catch {
              hasEmailAdminDoc = false;
            }
          }

          const authorized = isMasterEmail || hasUidAdminDoc || hasEmailAdminDoc;

          if (authorized) {
            setIsAdmin(true);
            setAuthError(null);

            // Sync/bootstrap admin UID doc in Firestore so security rules using request.auth.uid resolve immediately
            try {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                email: currentUser.email,
                displayName: currentUser.displayName || 'Administrator',
                role: 'admin',
                lastLoginAt: new Date().toISOString()
              }, { merge: true });
            } catch (e) {
              console.warn('Could not sync admin UID record in Firestore:', e);
            }
          } else {
            setIsAdmin(false);
            setAuthError(null);
          }
        } catch (err) {
          console.error('Error verifying admin permissions:', err);
          setIsAdmin(false);
          setAuthError('Lỗi kiểm tra quyền hạn quản trị. Vui lòng thử lại.');
        }
      } else {
        setIsAdmin(false);
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
      
      const isMasterEmail = loggedUser.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

      let hasAdminDoc = false;
      try {
        const docSnap = await getDoc(doc(db, 'admins', loggedUser.uid));
        hasAdminDoc = docSnap.exists();
      } catch {
        hasAdminDoc = false;
      }

      if (loggedUser.email && !hasAdminDoc) {
        try {
          const emailSnap = await getDoc(doc(db, 'admins', loggedUser.email.toLowerCase()));
          hasAdminDoc = emailSnap.exists();
        } catch {
          hasAdminDoc = false;
        }
      }

      const authorized = isMasterEmail || hasAdminDoc;

      if (!authorized) {
        setIsAdmin(false);
        setAuthError(
          `Tài khoản "${loggedUser.email}" không được cấp quyền quản trị. Vui lòng đăng nhập với tài khoản ${MASTER_ADMIN_EMAIL}.`
        );
        setIsLoading(false);
        return false;
      }

      setIsAdmin(true);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Admin Google sign-in failed:', err);
      let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Cửa sổ đăng nhập đã bị đóng trước khi hoàn tất.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Trình duyệt đã chặn popup. Vui lòng mở popup hoặc cho phép cửa sổ đăng nhập.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
    } catch (err) {
      console.error('Admin sign-out failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        clearError,
        authorizedAdminEmail: MASTER_ADMIN_EMAIL
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

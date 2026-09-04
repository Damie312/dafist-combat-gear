import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { Product } from '../types';
import { DEMO_PRODUCTS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products from Firestore.
 * If Firestore has no products, automatically seeds with all existing products first.
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log('Firestore products collection is empty. Migrating existing products...');
      await migrateExistingProductsToFirestore();
      // Refetch after migration
      const refetched = await getDocs(productsRef);
      return refetched.docs.map(doc => doc.data() as Product);
    }
    
    const products = snapshot.docs.map(doc => {
      const data = doc.data() as Product;
      // Default stock if not set
      if (typeof data.stock !== 'number') {
        data.stock = 35;
      }
      return data;
    });
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    // Return existing hardcoded products as robust fallback in case of transient network errors
    return DEMO_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID or Slug from Firestore.
 */
export async function getProductByIdFromFirestore(idOrSlug: string): Promise<Product | null> {
  try {
    // First try direct document lookup by ID
    const docRef = doc(db, PRODUCTS_COLLECTION, idOrSlug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Product;
      if (typeof data.stock !== 'number') data.stock = 35;
      return data;
    }
    
    // If not found by ID, query by slug
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, where('slug', '==', idOrSlug));
    const querySnap = await getDocs(q);
    
    if (!querySnap.empty) {
      const data = querySnap.docs[0].data() as Product;
      if (typeof data.stock !== 'number') data.stock = 35;
      return data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product ${idOrSlug} from Firestore:`, error);
    // Fallback to local array
    const fallback = DEMO_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return fallback || null;
  }
}

/**
 * Create a new product in Firestore.
 */
export async function createProductInFirestore(product: Product): Promise<Product> {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  const cleanProduct: Product = {
    ...product,
    stock: typeof product.stock === 'number' ? product.stock : 25,
    rating: product.rating || 5.0,
    reviewCount: product.reviewCount || 0,
    reviews: product.reviews || []
  };
  try {
    await setDoc(docRef, JSON.parse(JSON.stringify(cleanProduct)));
    return cleanProduct;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PRODUCTS_COLLECTION}/${product.id}`);
    throw error;
  }
}

/**
 * Update an existing product in Firestore.
 */
export async function updateProductInFirestore(id: string, updates: Partial<Product>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const cleanUpdates = JSON.parse(JSON.stringify(updates));
  try {
    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Update product inventory/stock level.
 */
export async function updateProductStockInFirestore(id: string, newStock: number): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  try {
    await updateDoc(docRef, { stock: Math.max(0, newStock) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Migrates all existing product data into Firestore.
 * Uses exact product IDs as document IDs to prevent duplicates.
 */
export async function migrateExistingProductsToFirestore(): Promise<{ count: number; success: boolean }> {
  try {
    const batch = writeBatch(db);
    
    for (const product of DEMO_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      const productWithStock: Product = {
        ...product,
        stock: product.stock ?? 35
      };
      // Clean undefined fields if any
      const cleanProduct = JSON.parse(JSON.stringify(productWithStock));
      batch.set(docRef, cleanProduct, { merge: true });
    }
    
    await batch.commit();
    console.log(`Successfully migrated ${DEMO_PRODUCTS.length} products to Firestore collection "products".`);
    return { count: DEMO_PRODUCTS.length, success: true };
  } catch (error) {
    console.error('Failed to migrate products to Firestore in batch, trying individual setDoc:', error);
    let count = 0;
    for (const product of DEMO_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
      const productWithStock: Product = {
        ...product,
        stock: product.stock ?? 35
      };
      const cleanProduct = JSON.parse(JSON.stringify(productWithStock));
      await setDoc(docRef, cleanProduct, { merge: true });
      count++;
    }
    return { count, success: true };
  }
}

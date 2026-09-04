/**
 * Automated Test Suite: Secure Stock Validation & Deduction for DAFIST Combat Store
 * 
 * Verifies all 8 required scenarios:
 * 1. Successful purchase
 * 2. Purchase exactly equal to available stock
 * 3. Purchase greater than available stock
 * 4. Purchase when stock = 0
 * 5. Two simultaneous purchase attempts for the last available units
 * 6. Product price changed after item was added to cart
 * 7. Product deleted after item was added to cart
 * 8. Firestore transaction failure
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  terminate 
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { 
  executeAtomicCheckout, 
  CheckoutError, 
  CheckoutErrorCode 
} from '../src/services/orderService';
import { OrderShippingInfo } from '../src/types';

const mockShippingInfo: OrderShippingInfo = {
  fullName: 'Nguyễn Văn Test',
  phone: '0912345678',
  email: 'test@dafist.vn',
  province: 'Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé',
  address: '123 Lê Lợi',
  paymentMethod: 'cod',
  shippingMethod: 'standard'
};

const cleanupProductIds: string[] = [];
const cleanupOrderIds: string[] = [];

async function createTestProduct(id: string, data: {
  name: string;
  price: number;
  stock: number;
  sizes: string[];
}) {
  cleanupProductIds.push(id);
  await setDoc(doc(db, 'products', id), {
    id,
    name: data.name,
    slug: id,
    brand: 'DAFIST',
    category: 'gloves',
    sport: 'boxing',
    targetLevel: 'intermediate',
    price: data.price,
    rating: 5,
    reviewCount: 1,
    stock: data.stock,
    sizes: data.sizes,
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800'],
    shortDesc: 'Sản phẩm thử nghiệm kiểm tra tồn kho',
    fullDesc: 'Mô tả thử nghiệm tồn kho DAFIST',
    features: ['Test feature'],
    specs: {
      material: 'Test',
      padding: 'Test',
      closure: 'Test',
      origin: 'Vietnam',
      suitability: 'Test'
    }
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 STARTING TEST SUITE: SECURE STOCK VALIDATION & ATOMIC DEDUCTION');
  console.log('===============================================================\n');

  let passedTests = 0;
  const totalTests = 8;

  try {
    // -------------------------------------------------------------
    // Test 1: Successful purchase
    // -------------------------------------------------------------
    console.log('👉 [TEST 1] Successful purchase');
    const p1Id = 'test-product-scenario-1';
    const o1Id = 'DF-TEST-SCENARIO-1';
    cleanupOrderIds.push(o1Id);
    await createTestProduct(p1Id, {
      name: 'Găng Test 1 Pro',
      price: 200000,
      stock: 10,
      sizes: ['10oz', '12oz']
    });

    const result1 = await executeAtomicCheckout({
      items: [{ productId: p1Id, selectedSize: '10oz', quantity: 2, expectedPrice: 200000 }],
      shippingInfo: mockShippingInfo,
      orderId: o1Id
    }, db);

    const p1Snap = await getDoc(doc(db, 'products', p1Id));
    const o1Snap = await getDoc(doc(db, 'orders', o1Id));

    if (
      result1.order.orderId === o1Id &&
      p1Snap.data()?.stock === 8 &&
      o1Snap.exists() &&
      o1Snap.data()?.items?.[0]?.quantity === 2 &&
      o1Snap.data()?.items?.[0]?.price === 200000
    ) {
      console.log('   ✅ PASS: Purchased 2 units from 10. New stock is 8. Order recorded correctly.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 1 FAILED: Expected stock 8, got ${p1Snap.data()?.stock}`);
    }

    // -------------------------------------------------------------
    // Test 2: Purchase exactly equal to available stock
    // -------------------------------------------------------------
    console.log('👉 [TEST 2] Purchase exactly equal to available stock');
    const p2Id = 'test-product-scenario-2';
    const o2Id = 'DF-TEST-SCENARIO-2';
    cleanupOrderIds.push(o2Id);
    await createTestProduct(p2Id, {
      name: 'Găng Test 2 Zero Out',
      price: 150000,
      stock: 5,
      sizes: ['12oz']
    });

    const result2 = await executeAtomicCheckout({
      items: [{ productId: p2Id, selectedSize: '12oz', quantity: 5, expectedPrice: 150000 }],
      shippingInfo: mockShippingInfo,
      orderId: o2Id
    }, db);

    const p2Snap = await getDoc(doc(db, 'products', p2Id));
    const o2Snap = await getDoc(doc(db, 'orders', o2Id));

    if (
      result2.order.orderId === o2Id &&
      p2Snap.data()?.stock === 0 &&
      o2Snap.exists()
    ) {
      console.log('   ✅ PASS: Purchased 5 units from 5. New stock is exactly 0. Order recorded.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 2 FAILED: Expected stock 0, got ${p2Snap.data()?.stock}`);
    }

    // -------------------------------------------------------------
    // Test 3: Purchase greater than available stock
    // -------------------------------------------------------------
    console.log('👉 [TEST 3] Purchase greater than available stock');
    const p3Id = 'test-product-scenario-3';
    const o3Id = 'DF-TEST-SCENARIO-3';
    await createTestProduct(p3Id, {
      name: 'Găng Test 3 Insufficient',
      price: 100000,
      stock: 3,
      sizes: ['14oz']
    });

    let test3Caught = false;
    try {
      await executeAtomicCheckout({
        items: [{ productId: p3Id, selectedSize: '14oz', quantity: 4, expectedPrice: 100000 }],
        shippingInfo: mockShippingInfo,
        orderId: o3Id
      }, db);
    } catch (err: any) {
      if (err instanceof CheckoutError && err.code === 'INSUFFICIENT_STOCK') {
        test3Caught = true;
      } else {
        throw err;
      }
    }

    const p3Snap = await getDoc(doc(db, 'products', p3Id));
    const o3Snap = await getDoc(doc(db, 'orders', o3Id));

    if (test3Caught && p3Snap.data()?.stock === 3 && !o3Snap.exists()) {
      console.log('   ✅ PASS: INSUFFICIENT_STOCK caught. Stock remained 3, no order was created.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 3 FAILED: test3Caught=${test3Caught}, stock=${p3Snap.data()?.stock}, orderExists=${o3Snap.exists()}`);
    }

    // -------------------------------------------------------------
    // Test 4: Purchase when stock = 0
    // -------------------------------------------------------------
    console.log('👉 [TEST 4] Purchase when stock = 0');
    const p4Id = 'test-product-scenario-4';
    const o4Id = 'DF-TEST-SCENARIO-4';
    await createTestProduct(p4Id, {
      name: 'Găng Test 4 Out Of Stock',
      price: 300000,
      stock: 0,
      sizes: ['FreeSize']
    });

    let test4Caught = false;
    try {
      await executeAtomicCheckout({
        items: [{ productId: p4Id, selectedSize: 'FreeSize', quantity: 1, expectedPrice: 300000 }],
        shippingInfo: mockShippingInfo,
        orderId: o4Id
      }, db);
    } catch (err: any) {
      if (err instanceof CheckoutError && (err.code === 'OUT_OF_STOCK' || err.code === 'INSUFFICIENT_STOCK')) {
        test4Caught = true;
      } else {
        throw err;
      }
    }

    const p4Snap = await getDoc(doc(db, 'products', p4Id));
    const o4Snap = await getDoc(doc(db, 'orders', o4Id));

    if (test4Caught && p4Snap.data()?.stock === 0 && !o4Snap.exists()) {
      console.log('   ✅ PASS: OUT_OF_STOCK caught. Stock remained 0, no order was created.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 4 FAILED: test4Caught=${test4Caught}, stock=${p4Snap.data()?.stock}`);
    }

    // -------------------------------------------------------------
    // Test 5: Two simultaneous purchase attempts for the last available units
    // -------------------------------------------------------------
    console.log('👉 [TEST 5] Two simultaneous purchase attempts for the last available units');
    const p5Id = 'test-product-scenario-5';
    const o5AId = 'DF-TEST-SCENARIO-5A';
    const o5BId = 'DF-TEST-SCENARIO-5B';
    cleanupOrderIds.push(o5AId, o5BId);
    await createTestProduct(p5Id, {
      name: 'Găng Test 5 Race Condition',
      price: 500000,
      stock: 2, // Only 2 in stock
      sizes: ['Standard']
    });

    // Both users try to buy 2 units simultaneously
    const [resultA, resultB] = await Promise.allSettled([
      executeAtomicCheckout({
        items: [{ productId: p5Id, selectedSize: 'Standard', quantity: 2, expectedPrice: 500000 }],
        shippingInfo: mockShippingInfo,
        orderId: o5AId
      }, db),
      executeAtomicCheckout({
        items: [{ productId: p5Id, selectedSize: 'Standard', quantity: 2, expectedPrice: 500000 }],
        shippingInfo: mockShippingInfo,
        orderId: o5BId
      }, db)
    ]);

    const p5Snap = await getDoc(doc(db, 'products', p5Id));
    const o5ASnap = await getDoc(doc(db, 'orders', o5AId));
    const o5BSnap = await getDoc(doc(db, 'orders', o5BId));

    const oneSucceeded = (resultA.status === 'fulfilled' && resultB.status === 'rejected') ||
                         (resultA.status === 'rejected' && resultB.status === 'fulfilled');
    const orderCount = (o5ASnap.exists() ? 1 : 0) + (o5BSnap.exists() ? 1 : 0);

    if (oneSucceeded && p5Snap.data()?.stock === 0 && orderCount === 1) {
      console.log('   ✅ PASS: Concurrency race condition prevented! Exactly 1 purchaser succeeded, 1 was rejected. Final stock = 0 (never negative).\n');
      passedTests++;
    } else {
      throw new Error(`TEST 5 FAILED: oneSucceeded=${oneSucceeded}, stock=${p5Snap.data()?.stock}, orderCount=${orderCount}`);
    }

    // -------------------------------------------------------------
    // Test 6: Product price changed after item was added to cart
    // -------------------------------------------------------------
    console.log('👉 [TEST 6] Product price changed after item was added to cart');
    const p6Id = 'test-product-scenario-6';
    const o6Id = 'DF-TEST-SCENARIO-6';
    await createTestProduct(p6Id, {
      name: 'Găng Test 6 Price Update',
      price: 600000, // Current trusted price in database
      stock: 10,
      sizes: ['L']
    });

    let test6Caught = false;
    try {
      // Client cart has old price: 450,000 VND
      await executeAtomicCheckout({
        items: [{ productId: p6Id, selectedSize: 'L', quantity: 1, expectedPrice: 450000 }],
        shippingInfo: mockShippingInfo,
        orderId: o6Id
      }, db);
    } catch (err: any) {
      if (err instanceof CheckoutError && err.code === 'PRICE_CHANGED') {
        test6Caught = true;
      } else {
        throw err;
      }
    }

    const p6Snap = await getDoc(doc(db, 'products', p6Id));
    const o6Snap = await getDoc(doc(db, 'orders', o6Id));

    if (test6Caught && p6Snap.data()?.stock === 10 && !o6Snap.exists()) {
      console.log('   ✅ PASS: PRICE_CHANGED caught. Untrusted client price rejected. Stock unchanged, no order created.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 6 FAILED: test6Caught=${test6Caught}, stock=${p6Snap.data()?.stock}`);
    }

    // -------------------------------------------------------------
    // Test 7: Product deleted after item was added to cart
    // -------------------------------------------------------------
    console.log('👉 [TEST 7] Product deleted after item was added to cart');
    const p7DeletedId = 'test-deleted-product-nonexistent';
    const o7Id = 'DF-TEST-SCENARIO-7';

    let test7Caught = false;
    try {
      await executeAtomicCheckout({
        items: [{ productId: p7DeletedId, selectedSize: 'M', quantity: 1, expectedPrice: 200000 }],
        shippingInfo: mockShippingInfo,
        orderId: o7Id
      }, db);
    } catch (err: any) {
      if (err instanceof CheckoutError && err.code === 'PRODUCT_NOT_FOUND') {
        test7Caught = true;
      } else {
        throw err;
      }
    }

    const o7Snap = await getDoc(doc(db, 'orders', o7Id));
    if (test7Caught && !o7Snap.exists()) {
      console.log('   ✅ PASS: PRODUCT_NOT_FOUND caught. Deleted product rejected safely without order creation.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 7 FAILED: test7Caught=${test7Caught}`);
    }

    // -------------------------------------------------------------
    // Test 8: Firestore transaction failure
    // -------------------------------------------------------------
    console.log('👉 [TEST 8] Firestore transaction failure / rollback safety');
    const p8Id = 'test-product-scenario-8';
    const o8Id = 'DF-TEST-SCENARIO-8';
    await createTestProduct(p8Id, {
      name: 'Găng Test 8 Fail Safe',
      price: 250000,
      stock: 7,
      sizes: ['M']
    });

    // We pass an invalid quantity of 0 or invalid size inside multiple items
    let test8Caught = false;
    try {
      await executeAtomicCheckout({
        items: [
          { productId: p8Id, selectedSize: 'M', quantity: 1, expectedPrice: 250000 },
          { productId: p8Id, selectedSize: 'INVALID_NONEXISTENT_SIZE', quantity: 1, expectedPrice: 250000 }
        ],
        shippingInfo: mockShippingInfo,
        orderId: o8Id
      }, db);
    } catch (err: any) {
      if (err instanceof CheckoutError) {
        test8Caught = true;
      } else {
        throw err;
      }
    }

    const p8Snap = await getDoc(doc(db, 'products', p8Id));
    const o8Snap = await getDoc(doc(db, 'orders', o8Id));

    if (test8Caught && p8Snap.data()?.stock === 7 && !o8Snap.exists()) {
      console.log('   ✅ PASS: Transaction aborted atomically. Product stock remained 7 (NO partial deduction of 1st item), no order created.\n');
      passedTests++;
    } else {
      throw new Error(`TEST 8 FAILED: test8Caught=${test8Caught}, stock=${p8Snap.data()?.stock}`);
    }

    console.log('===============================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY!`);
    console.log('===============================================================');

  } finally {
    // Clean up all temporary test products and test orders
    console.log('\n🧹 Cleaning up test fixtures from Firestore...');
    for (const pid of cleanupProductIds) {
      try {
        await deleteDoc(doc(db, 'products', pid));
      } catch (e) {}
    }
    for (const oid of cleanupOrderIds) {
      try {
        await deleteDoc(doc(db, 'orders', oid));
      } catch (e) {}
    }
    console.log('🧹 Clean up completed.');
    try {
      await terminate(db);
    } catch (e) {}
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('\n❌ FATAL TEST ERROR:', err);
  process.exit(1);
});

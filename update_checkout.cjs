const fs = require('fs');
const content = fs.readFileSync('src/services/orderService.ts', 'utf8');

const importReplacement = `import { formatVND } from '../utils/formatters';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';`;

let newContent = content.replace(/import \{ formatVND \} from '\.\.\/utils\/formatters';/, importReplacement);

const functionStart = newContent.indexOf('export async function executeAtomicCheckout');
const functionEnd = newContent.indexOf('export async function createOrderInFirestore') - 10; // some margin for comments

const functionBody = `export async function executeAtomicCheckout(
  params: ExecuteCheckoutParams,
  firestoreDb = db
): Promise<ExecuteCheckoutResult> {
  const { 
    items, 
    shippingInfo, 
    shippingMethod,
    paymentMethod,
    idempotencyKey,
  } = params;

  if (!items || items.length === 0) {
    throw new CheckoutError('INVALID_QUANTITY', 'Giỏ hàng của bạn đang trống.');
  }

  const targetOrderId = idempotencyKey || \`DF-\${Math.floor(100000 + Math.random() * 900000)}\`;

  try {
    const executeCheckout = httpsCallable(functions, 'executeCheckout');
    
    // We only send trusted primitives, ignoring any client-calculated subtotals or prices
    const response = await executeCheckout({
      items: items.map(item => ({
        productId: item.productId,
        selectedSize: item.selectedSize,
        quantity: item.quantity
      })),
      shippingInfo,
      shippingMethod,
      paymentMethod,
      idempotencyKey: targetOrderId
    });

    const orderData = response.data as PlacedOrder;

    return {
      order: normalizeOrder(orderData),
      deductions: [] // No longer tracking local deductions, server handles this safely
    };
  } catch (error: any) {
    console.error('Cloud Function checkout failed:', error);
    
    const errorCode = error?.code || 'internal';
    const message = error?.message || 'Quá trình đặt hàng thất bại.';

    if (errorCode === 'not-found') {
       throw new CheckoutError('PRODUCT_NOT_FOUND', message);
    }
    if (errorCode === 'failed-precondition') {
       throw new CheckoutError('OUT_OF_STOCK', message);
    }
    if (errorCode === 'invalid-argument') {
       throw new CheckoutError('INVALID_QUANTITY', message);
    }
    
    throw new CheckoutError(
      'TRANSACTION_FAILED',
      message,
      { originalError: error }
    );
  }
}
`;

newContent = newContent.substring(0, functionStart) + functionBody + '\n' + newContent.substring(newContent.indexOf('/**', functionEnd));
fs.writeFileSync('src/services/orderService.ts', newContent);

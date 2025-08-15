"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createPaymentMethodSchema = zod_1.z.object({
    type: zod_1.z.enum(['card', 'bank_account']),
    cardNumber: zod_1.z.string().optional(),
    expiryMonth: zod_1.z.number().min(1).max(12).optional(),
    expiryYear: zod_1.z.number().min(new Date().getFullYear()).optional(),
    cvv: zod_1.z.string().length(3).optional(),
    accountNumber: zod_1.z.string().optional(),
    routingNumber: zod_1.z.string().optional(),
});
router.get('/', async (req, res) => {
    try {
        res.json({
            message: 'Payment history retrieved successfully',
            payments: [
                {
                    id: '1',
                    amount: 50.00,
                    currency: 'USD',
                    status: 'completed',
                    type: 'membership_fee',
                    description: 'Monthly membership fee - January 2024',
                    date: new Date('2024-01-01').toISOString(),
                    paymentMethod: 'card',
                    invoiceId: 'INV-001',
                },
                {
                    id: '2',
                    amount: 25.00,
                    currency: 'USD',
                    status: 'completed',
                    type: 'class_fee',
                    description: 'Advanced Training Class',
                    date: new Date('2024-01-15').toISOString(),
                    paymentMethod: 'card',
                    invoiceId: 'INV-002',
                },
            ],
            total: 2,
        });
    }
    catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            error: 'Failed to fetch payment history',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        res.json({
            message: 'Payment details retrieved successfully',
            payment: {
                id: paymentId,
                amount: 50.00,
                currency: 'USD',
                status: 'completed',
                type: 'membership_fee',
                description: 'Monthly membership fee - January 2024',
                date: new Date('2024-01-01').toISOString(),
                paymentMethod: 'card',
                invoiceId: 'INV-001',
                receipt: {
                    url: '/receipts/INV-001.pdf',
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({
            error: 'Failed to fetch payment details',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/methods', async (req, res) => {
    try {
        res.json({
            message: 'Payment methods retrieved successfully',
            paymentMethods: [
                {
                    id: '1',
                    type: 'card',
                    last4: '1234',
                    brand: 'visa',
                    expiryMonth: 12,
                    expiryYear: 2025,
                    isDefault: true,
                },
                {
                    id: '2',
                    type: 'bank_account',
                    last4: '5678',
                    bankName: 'Chase Bank',
                    isDefault: false,
                },
            ],
        });
    }
    catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({
            error: 'Failed to fetch payment methods',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/methods', async (req, res) => {
    try {
        const validatedData = createPaymentMethodSchema.parse(req.body);
        res.status(201).json({
            message: 'Payment method added successfully',
            paymentMethod: {
                id: 'new-method-id',
                type: validatedData.type,
                last4: validatedData.type === 'card' ? '1234' : '5678',
                brand: validatedData.type === 'card' ? 'visa' : undefined,
                isDefault: false,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                details: error.errors,
            });
            return;
        }
        console.error('Error adding payment method:', error);
        res.status(500).json({
            error: 'Failed to add payment method',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.delete('/methods/:methodId', async (req, res) => {
    try {
        const { methodId } = req.params;
        res.json({
            message: 'Payment method removed successfully',
            methodId,
        });
    }
    catch (error) {
        console.error('Error removing payment method:', error);
        res.status(500).json({
            error: 'Failed to remove payment method',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/invoices', async (req, res) => {
    try {
        res.json({
            message: 'Invoice history retrieved successfully',
            invoices: [
                {
                    id: 'INV-001',
                    amount: 50.00,
                    currency: 'USD',
                    status: 'paid',
                    dueDate: new Date('2024-01-01').toISOString(),
                    paidDate: new Date('2024-01-01').toISOString(),
                    description: 'Monthly membership fee - January 2024',
                    items: [
                        {
                            description: 'Premium Membership',
                            amount: 50.00,
                            quantity: 1,
                        },
                    ],
                },
            ],
            total: 1,
        });
    }
    catch (error) {
        console.error('Error fetching invoice history:', error);
        res.status(500).json({
            error: 'Failed to fetch invoice history',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=payments.js.map
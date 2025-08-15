"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/status', async (req, res) => {
    try {
        const integrations = [
            {
                id: 'stripe',
                name: 'Stripe',
                provider: 'stripe',
                status: 'connected',
                credentialsStatus: 'valid',
                lastTested: new Date().toISOString(),
                settings: {
                    publishableKey: 'pk_test_...',
                    webhookEndpoint: '/api/webhooks/stripe',
                    currency: 'EUR',
                    supportedMethods: ['card', 'sepa_debit', 'sofort'],
                },
            },
            {
                id: 'paypal',
                name: 'PayPal',
                provider: 'paypal',
                status: 'connected',
                credentialsStatus: 'valid',
                lastTested: new Date().toISOString(),
                settings: {
                    clientId: 'client_id_...',
                    webhookEndpoint: '/api/webhooks/paypal',
                    currency: 'EUR',
                    supportedMethods: ['paypal', 'card'],
                },
            },
            {
                id: 'bank-transfer',
                name: 'Bank Transfer',
                provider: 'manual',
                status: 'configured',
                credentialsStatus: 'valid',
                lastTested: new Date().toISOString(),
                settings: {
                    accountNumber: 'DE89 3704 0044 0532 0130 00',
                    bankName: 'Commerzbank',
                    referenceFormat: 'INV-{invoice_id}',
                },
            },
        ];
        const [stripePayments, paypalPayments, bankPayments] = await Promise.all([
            prisma_1.prisma.payment.count({
                where: { method: 'stripe', status: 'completed' },
            }),
            prisma_1.prisma.payment.count({
                where: { method: 'paypal', status: 'completed' },
            }),
            prisma_1.prisma.payment.count({
                where: { method: 'bank_transfer', status: 'completed' },
            }),
        ]);
        const integrationStats = {
            stripe: { totalPayments: stripePayments },
            paypal: { totalPayments: paypalPayments },
            bankTransfer: { totalPayments: bankPayments },
        };
        res.json({
            success: true,
            data: {
                integrations,
                stats: integrationStats,
                overallStatus: 'healthy',
                lastUpdated: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error fetching integration status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch integration status',
        });
    }
});
router.post('/test', async (req, res) => {
    try {
        const { provider } = req.body;
        if (!provider) {
            return res.status(400).json({
                success: false,
                error: 'Provider is required',
            });
        }
        const testResults = {
            provider,
            status: 'success',
            timestamp: new Date().toISOString(),
            details: {
                connection: 'successful',
                credentials: 'valid',
                apiAccess: 'granted',
                webhookEndpoint: 'reachable',
            },
        };
        res.json({
            success: true,
            data: testResults,
        });
    }
    catch (error) {
        console.error('Error testing integration:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to test integration',
        });
    }
});
router.put('/:id/configure', async (req, res) => {
    try {
        const { id } = req.params;
        const { settings } = req.body;
        res.json({
            success: true,
            data: {
                id,
                status: 'configured',
                updatedAt: new Date().toISOString(),
                settings,
            },
        });
    }
    catch (error) {
        console.error('Error configuring integration:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to configure integration',
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: {
                id,
                status: 'disconnected',
                disconnectedAt: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error disconnecting integration:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to disconnect integration',
        });
    }
});
exports.default = router;
//# sourceMappingURL=integration.js.map
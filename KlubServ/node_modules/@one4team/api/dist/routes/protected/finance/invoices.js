"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../../lib/prisma");
const validation_1 = require("../../../middleware/validation");
const router = (0, express_1.Router)();
const createInvoiceSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    status: zod_1.z.enum(['paid', 'pending', 'overdue']).default('pending'),
    dueDate: zod_1.z.string().datetime(),
    description: zod_1.z.string().optional(),
});
const updateInvoiceSchema = createInvoiceSchema.partial();
router.get('/', async (req, res) => {
    try {
        const { status, search, sortBy = 'dueDate', sortOrder = 'asc', page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const orderBy = {};
        if (sortBy === 'dueDate') {
            orderBy.dueDate = sortOrder;
        }
        else if (sortBy === 'amount') {
            orderBy.amount = sortOrder;
        }
        else if (sortBy === 'createdAt') {
            orderBy.createdAt = sortOrder;
        }
        else {
            orderBy.dueDate = 'asc';
        }
        const [invoices, total] = await Promise.all([
            prisma_1.prisma.invoice.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma_1.prisma.invoice.count({ where }),
        ]);
        res.json({
            success: true,
            data: invoices,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch invoices',
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await prisma_1.prisma.invoice.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!invoice) {
            return res.status(404).json({
                success: false,
                error: 'Invoice not found',
            });
        }
        res.json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch invoice',
        });
    }
});
router.post('/', (0, validation_1.validateRequest)(createInvoiceSchema), async (req, res) => {
    try {
        const invoice = await prisma_1.prisma.invoice.create({
            data: {
                ...req.body,
                dueDate: new Date(req.body.dueDate),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create invoice',
        });
    }
});
router.put('/:id', (0, validation_1.validateRequest)(updateInvoiceSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.body.dueDate) {
            updateData.dueDate = new Date(req.body.dueDate);
        }
        const invoice = await prisma_1.prisma.invoice.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update invoice',
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.invoice.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Invoice deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete invoice',
        });
    }
});
exports.default = router;
//# sourceMappingURL=invoices.js.map
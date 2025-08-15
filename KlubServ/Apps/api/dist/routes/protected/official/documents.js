"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const mockDocuments = [
    {
        id: '1',
        name: 'Club Constitution 2024',
        type: 'PDF',
        category: 'legal',
        uploadDate: '2024-01-01T00:00:00Z',
        size: '2.3 MB',
        description: 'Updated club constitution and bylaws for 2024',
        author: 'Legal Committee',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/1/download',
        tags: ['constitution', 'legal', 'bylaws']
    },
    {
        id: '2',
        name: 'Financial Report Q4 2023',
        type: 'PDF',
        category: 'financial',
        uploadDate: '2024-01-05T00:00:00Z',
        size: '1.8 MB',
        description: 'Quarterly financial report and budget overview for Q4 2023',
        author: 'Treasurer',
        version: '2023.4',
        isPublic: false,
        downloadUrl: '/api/official/documents/2/download',
        tags: ['financial', 'report', 'budget']
    },
    {
        id: '3',
        name: 'Strategic Plan 2024-2026',
        type: 'PDF',
        category: 'strategy',
        uploadDate: '2024-01-10T00:00:00Z',
        size: '3.1 MB',
        description: 'Three-year strategic development plan for the club',
        author: 'Board of Directors',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/3/download',
        tags: ['strategy', 'planning', 'development']
    },
    {
        id: '4',
        name: 'Safety Guidelines',
        type: 'PDF',
        category: 'safety',
        uploadDate: '2024-01-12T00:00:00Z',
        size: '1.2 MB',
        description: 'Updated safety and security guidelines for all club activities',
        author: 'Safety Officer',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/4/download',
        tags: ['safety', 'guidelines', 'security']
    },
    {
        id: '5',
        name: 'Board Meeting Minutes - January 2024',
        type: 'PDF',
        category: 'minutes',
        uploadDate: '2024-01-15T00:00:00Z',
        size: '0.8 MB',
        description: 'Official minutes from the January 2024 board meeting',
        author: 'Board Secretary',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/5/download',
        tags: ['minutes', 'board', 'meeting']
    },
    {
        id: '6',
        name: 'Facility Maintenance Schedule',
        type: 'PDF',
        category: 'maintenance',
        uploadDate: '2024-01-08T00:00:00Z',
        size: '1.5 MB',
        description: 'Annual facility maintenance and inspection schedule',
        author: 'Facility Manager',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/6/download',
        tags: ['maintenance', 'facility', 'schedule']
    },
    {
        id: '7',
        name: 'Training Program Overview',
        type: 'PDF',
        category: 'training',
        uploadDate: '2024-01-03T00:00:00Z',
        size: '2.1 MB',
        description: 'Comprehensive overview of training programs and schedules',
        author: 'Head Trainer',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/7/download',
        tags: ['training', 'program', 'schedule']
    },
    {
        id: '8',
        name: 'Emergency Contact List',
        type: 'PDF',
        category: 'emergency',
        uploadDate: '2024-01-20T00:00:00Z',
        size: '0.5 MB',
        description: 'Updated emergency contact information for all club officials',
        author: 'Safety Officer',
        version: '2024.1',
        isPublic: false,
        downloadUrl: '/api/official/documents/8/download',
        tags: ['emergency', 'contacts', 'safety']
    }
];
const getDocumentsSchema = zod_1.z.object({
    type: zod_1.z.enum(['PDF', 'DOC', 'XLS', 'all']).optional(),
    category: zod_1.z.enum(['legal', 'financial', 'strategy', 'safety', 'minutes', 'maintenance', 'training', 'emergency', 'all']).optional(),
    search: zod_1.z.string().optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(50)).optional().default(10),
    offset: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional().default(0),
    sortBy: zod_1.z.enum(['name', 'uploadDate', 'size', 'category']).optional().default('uploadDate'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
});
router.get('/', async (req, res) => {
    try {
        const validatedQuery = getDocumentsSchema.parse(req.query);
        let filteredDocuments = mockDocuments.filter(doc => {
            if (validatedQuery.type && validatedQuery.type !== 'all') {
                if (doc.type !== validatedQuery.type) {
                    return false;
                }
            }
            if (validatedQuery.category && validatedQuery.category !== 'all') {
                if (doc.category !== validatedQuery.category) {
                    return false;
                }
            }
            if (validatedQuery.search) {
                const searchTerm = validatedQuery.search.toLowerCase();
                const matchesName = doc.name.toLowerCase().includes(searchTerm);
                const matchesDescription = doc.description.toLowerCase().includes(searchTerm);
                const matchesAuthor = doc.author.toLowerCase().includes(searchTerm);
                const matchesTags = doc.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                if (!matchesName && !matchesDescription && !matchesAuthor && !matchesTags) {
                    return false;
                }
            }
            return true;
        });
        filteredDocuments.sort((a, b) => {
            let aValue, bValue;
            switch (validatedQuery.sortBy) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'uploadDate':
                    aValue = new Date(a.uploadDate);
                    bValue = new Date(b.uploadDate);
                    break;
                case 'size':
                    aValue = parseFloat(a.size.replace(' MB', ''));
                    bValue = parseFloat(b.size.replace(' MB', ''));
                    break;
                case 'category':
                    aValue = a.category;
                    bValue = b.category;
                    break;
                default:
                    aValue = new Date(a.uploadDate);
                    bValue = new Date(b.uploadDate);
            }
            if (validatedQuery.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        const total = filteredDocuments.length;
        const documents = filteredDocuments.slice(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit);
        res.json({
            success: true,
            data: {
                documents,
                pagination: {
                    total,
                    limit: validatedQuery.limit,
                    offset: validatedQuery.offset,
                    hasMore: validatedQuery.offset + validatedQuery.limit < total
                }
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid query parameters',
                details: error.errors
            });
        }
        console.error('Error fetching documents:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = mockDocuments.find(d => d.id === id);
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }
        res.json({
            success: true,
            data: document
        });
    }
    catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        const document = mockDocuments.find(d => d.id === id);
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }
        res.json({
            success: true,
            data: {
                message: 'Document download initiated',
                document: {
                    id: document.id,
                    name: document.name,
                    downloadUrl: document.downloadUrl,
                    size: document.size
                }
            }
        });
    }
    catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const categories = [...new Set(mockDocuments.map(doc => doc.category))].sort();
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=documents.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const mockDocuments = [
    {
        id: 'doc_1',
        name: 'Player Card',
        type: 'player_card',
        status: 'active',
        url: '/api/players/123/card',
        qrCode: '/api/players/123/qr',
        validUntil: '2024-08-31',
        createdAt: '2023-09-01',
        description: 'Official player identification card with QR code'
    },
    {
        id: 'doc_2',
        name: 'Medical Certificate',
        type: 'medical',
        status: 'valid',
        url: '/api/players/123/medical',
        validUntil: '2024-06-30',
        createdAt: '2023-12-01',
        description: 'Annual medical fitness certificate'
    },
    {
        id: 'doc_3',
        name: 'Insurance Certificate',
        type: 'insurance',
        status: 'active',
        url: '/api/players/123/insurance',
        validUntil: '2024-08-31',
        createdAt: '2023-09-01',
        description: 'Sports accident insurance coverage'
    },
    {
        id: 'doc_4',
        name: 'Parental Consent Form',
        type: 'consent',
        status: 'signed',
        url: '/api/players/123/consent',
        validUntil: '2024-08-31',
        createdAt: '2023-09-01',
        description: 'Parental consent for participation'
    }
];
const mockPlayerCard = {
    id: 'player_123',
    cardNumber: 'PC-2024-00123',
    playerName: 'Max Müller',
    team: 'U14 Boys',
    ageGroup: 'U14',
    position: 'Midfielder',
    photo: '/api/players/123/photo',
    qrCode: '/api/players/123/qr',
    validFrom: '2023-09-01',
    validUntil: '2024-08-31',
    club: {
        name: 'TSV München',
        logo: '/api/club/logo',
        address: 'Sportplatz 1, 80331 München'
    }
};
router.get('/', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json({
            success: true,
            data: mockDocuments
        });
    }
    catch (error) {
        console.error('Error fetching player documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/card', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json({
            success: true,
            data: mockPlayerCard
        });
    }
    catch (error) {
        console.error('Error fetching player card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const document = mockDocuments.find(d => d.id === id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({
            success: true,
            data: document
        });
    }
    catch (error) {
        console.error('Error fetching document details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id/download', (req, res) => {
    try {
        const { id } = req.params;
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const document = mockDocuments.find(d => d.id === id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({
            success: true,
            data: {
                downloadUrl: document.url,
                filename: `${document.name}.pdf`,
                contentType: 'application/pdf'
            }
        });
    }
    catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=documents.js.map
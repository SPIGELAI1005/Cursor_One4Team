"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const mockEvaluations = [
    {
        id: 'eval_1',
        playerId: 'player_123',
        trainerId: 'trainer_789',
        trainerName: 'Thomas Weber',
        date: '2024-01-10',
        rating: 4,
        category: 'technical',
        comment: 'Excellent ball control and passing accuracy. Shows great improvement in tactical awareness.',
        strengths: ['Ball control', 'Passing accuracy', 'Teamwork'],
        areasForImprovement: ['Speed', 'Shooting power'],
        goals: ['Improve shooting technique', 'Increase running speed'],
        nextEvaluationDate: '2024-02-10',
        status: 'completed'
    },
    {
        id: 'eval_2',
        playerId: 'player_123',
        trainerId: 'trainer_456',
        trainerName: 'Maria Schmidt',
        date: '2023-12-15',
        rating: 3,
        category: 'fitness',
        comment: 'Good endurance but needs to work on strength training. Consistent attendance at sessions.',
        strengths: ['Endurance', 'Attendance', 'Motivation'],
        areasForImprovement: ['Strength', 'Power'],
        goals: ['Increase muscle strength', 'Improve sprint speed'],
        nextEvaluationDate: '2024-01-15',
        status: 'completed'
    },
    {
        id: 'eval_3',
        playerId: 'player_123',
        trainerId: 'trainer_789',
        trainerName: 'Thomas Weber',
        date: '2023-11-20',
        rating: 4,
        category: 'tactical',
        comment: 'Strong understanding of team tactics. Good positioning and communication on field.',
        strengths: ['Tactical awareness', 'Positioning', 'Communication'],
        areasForImprovement: ['Decision making under pressure'],
        goals: ['Improve quick decision making', 'Enhance leadership skills'],
        nextEvaluationDate: '2023-12-20',
        status: 'completed'
    }
];
router.get('/', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const sortedEvaluations = mockEvaluations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.json({
            success: true,
            data: sortedEvaluations
        });
    }
    catch (error) {
        console.error('Error fetching player evaluations:', error);
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
        const evaluation = mockEvaluations.find(e => e.id === id);
        if (!evaluation) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }
        res.json({
            success: true,
            data: evaluation
        });
    }
    catch (error) {
        console.error('Error fetching evaluation details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/stats', (req, res) => {
    try {
        const playerId = req.user?.id;
        if (!playerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (playerId !== 'player_123') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const stats = {
            totalEvaluations: mockEvaluations.length,
            averageRating: mockEvaluations.reduce((sum, eval) => sum + eval.rating, 0) / mockEvaluations.length,
            latestRating: mockEvaluations[0]?.rating || 0,
            categories: {
                technical: mockEvaluations.filter(e => e.category === 'technical').length,
                tactical: mockEvaluations.filter(e => e.category === 'tactical').length,
                fitness: mockEvaluations.filter(e => e.category === 'fitness').length
            },
            progress: {
                lastMonth: 4,
                lastQuarter: 3.5,
                overall: 3.7
            }
        };
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching evaluation statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=evaluations.js.map
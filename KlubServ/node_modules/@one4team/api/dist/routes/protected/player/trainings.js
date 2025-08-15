"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const mockTrainings = [
    {
        id: 'training_1',
        title: 'Technical Skills Training',
        date: '2024-01-15',
        time: '16:00',
        duration: 90,
        location: 'Main Field',
        trainingType: 'technical',
        isMandatory: true,
        description: 'Focus on ball control, dribbling, and passing techniques',
        coach: 'Thomas Weber',
        team: 'U14 Boys',
        status: 'scheduled'
    },
    {
        id: 'training_2',
        title: 'Tactical Session',
        date: '2024-01-17',
        time: '17:30',
        duration: 75,
        location: 'Training Ground A',
        trainingType: 'tactical',
        isMandatory: false,
        description: 'Team formation and positioning exercises',
        coach: 'Thomas Weber',
        team: 'U14 Boys',
        status: 'scheduled'
    },
    {
        id: 'training_3',
        title: 'Fitness & Conditioning',
        date: '2024-01-19',
        time: '15:00',
        duration: 60,
        location: 'Gym',
        trainingType: 'fitness',
        isMandatory: true,
        description: 'Strength training and endurance building',
        coach: 'Maria Schmidt',
        team: 'U14 Boys',
        status: 'scheduled'
    }
];
const mockTrainingPlan = {
    id: 'plan_1',
    title: 'U14 Development Plan - January 2024',
    goal: 'Improve technical skills and team coordination',
    focus: 'Ball control, passing accuracy, tactical awareness',
    exercises: [
        {
            name: 'Warm-up',
            duration: 15,
            description: 'Dynamic stretching and light jogging'
        },
        {
            name: 'Technical Drills',
            duration: 30,
            description: 'Ball control exercises with cones'
        },
        {
            name: 'Passing Practice',
            duration: 25,
            description: 'Short and long-range passing drills'
        },
        {
            name: 'Small-sided Games',
            duration: 20,
            description: '3v3 and 5v5 matches'
        }
    ],
    attachments: [
        {
            id: 'att_1',
            name: 'Training Plan PDF',
            type: 'pdf',
            url: '/api/trainings/plan_1/document'
        },
        {
            id: 'att_2',
            name: 'Exercise Videos',
            type: 'video',
            url: '/api/trainings/plan_1/videos'
        }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
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
        const today = new Date().toISOString().split('T')[0];
        const upcomingTrainings = mockTrainings.filter(training => training.date >= today);
        res.json({
            success: true,
            data: upcomingTrainings
        });
    }
    catch (error) {
        console.error('Error fetching player trainings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/plan', (req, res) => {
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
            data: mockTrainingPlan
        });
    }
    catch (error) {
        console.error('Error fetching training plan:', error);
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
        const training = mockTrainings.find(t => t.id === id);
        if (!training) {
            return res.status(404).json({ error: 'Training not found' });
        }
        res.json({
            success: true,
            data: training
        });
    }
    catch (error) {
        console.error('Error fetching training details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=trainings.js.map
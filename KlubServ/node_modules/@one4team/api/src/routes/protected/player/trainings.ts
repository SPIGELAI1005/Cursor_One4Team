import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Mock training data - replace with actual database queries
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

// GET /api/player/trainings - Get upcoming training sessions
router.get('/', (req, res) => {
  try {
    const playerId = req.user?.id;
    
    if (!playerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock: verify player can only access their own trainings
    if (playerId !== 'player_123') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Filter trainings for current date and future
    const today = new Date().toISOString().split('T')[0];
    const upcomingTrainings = mockTrainings.filter(training => 
      training.date >= today
    );

    res.json({
      success: true,
      data: upcomingTrainings
    });
  } catch (error) {
    console.error('Error fetching player trainings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/player/trainings/plan - Get current training plan
router.get('/plan', (req, res) => {
  try {
    const playerId = req.user?.id;
    
    if (!playerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock: verify player can only access their own training plan
    if (playerId !== 'player_123') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: mockTrainingPlan
    });
  } catch (error) {
    console.error('Error fetching training plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/player/trainings/:id - Get specific training details
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const playerId = req.user?.id;
    
    if (!playerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock: verify player can only access their own trainings
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
  } catch (error) {
    console.error('Error fetching training details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
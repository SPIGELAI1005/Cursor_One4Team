import { Router } from 'express';
import { requireRole } from '../../../middleware/authMiddleware';

const router = Router();

// Apply press-news role protection
router.use(requireRole(['press-news']));

// GET /api/press-news/news - Get public news articles
router.get('/', async (req, res) => {
  try {
    const { visibility = 'public', category, limit = 10, offset = 0 } = req.query;

    // Mock data - in real implementation, fetch from database
    const mockNews = [
      {
        id: '1',
        title: 'Club Announces New Youth Development Program',
        category: 'General',
        publishDate: '2024-01-15',
        summary: 'The club is excited to announce the launch of a comprehensive youth development program aimed at nurturing local talent.',
        url: '/news/youth-development-program',
        readTime: 3,
        visibility: 'public'
      },
      {
        id: '2',
        title: 'Match Report: Victory Against Local Rivals',
        category: 'Match Reports',
        publishDate: '2024-01-12',
        summary: 'A thrilling 3-2 victory in the local derby with standout performances from our midfield.',
        url: '/news/match-report-victory',
        readTime: 5,
        visibility: 'public'
      },
      {
        id: '3',
        title: 'Annual Charity Tournament Registration Open',
        category: 'Events',
        publishDate: '2024-01-10',
        summary: 'Registration is now open for our annual charity tournament supporting local community initiatives.',
        url: '/news/charity-tournament',
        readTime: 2,
        visibility: 'public'
      }
    ];

    // Filter by visibility (only public content for press-news)
    let filteredNews = mockNews.filter(article => article.visibility === 'public');

    // Filter by category if provided
    if (category && category !== 'All') {
      filteredNews = filteredNews.filter(article => article.category === category);
    }

    // Apply pagination
    const paginatedNews = filteredNews.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        articles: paginatedNews,
        total: filteredNews.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch news articles' 
    });
  }
});

// GET /api/press-news/news/:id - Get specific news article
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock data - in real implementation, fetch from database
    const mockArticle = {
      id: '1',
      title: 'Club Announces New Youth Development Program',
      category: 'General',
      publishDate: '2024-01-15',
      content: 'The club is excited to announce the launch of a comprehensive youth development program aimed at nurturing local talent. This initiative represents our commitment to fostering the next generation of athletes and community leaders.',
      author: 'Club Communications',
      readTime: 3,
      visibility: 'public',
      tags: ['youth', 'development', 'community']
    };

    if (mockArticle.visibility !== 'public') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this article' 
      });
    }

    res.json({
      success: true,
      data: mockArticle
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch article' 
    });
  }
});

export default router; 
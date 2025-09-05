import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCategories, createCategory } from '@/lib/data/categoryService';

// /api/categories
// GET: list
// POST: create (idempotent by name)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const categories = await getAllCategories();
      return res.status(200).json({ data: categories });
    }

    if (req.method === 'POST') {
      const { name } = req.body as { name?: string };
      if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
      const cat = await createCategory(name);
      return res.status(201).json({ data: cat });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


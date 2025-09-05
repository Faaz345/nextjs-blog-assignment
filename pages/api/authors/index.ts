import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllAuthors, createAuthor } from '@/lib/data/authorService';

// /api/authors
// GET: list
// POST: create (idempotent by name)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const authors = await getAllAuthors();
      return res.status(200).json({ data: authors });
    }

    if (req.method === 'POST') {
      const { name, bio } = req.body as { name?: string; bio?: string };
      if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
      const author = await createAuthor(name, bio);
      return res.status(201).json({ data: author });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


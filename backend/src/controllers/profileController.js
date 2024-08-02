console.log('Loading models from ../models'); // Debugging line
import { Profile } from '../models/index.js';
console.log('Models loaded successfully'); // Debugging line

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { id: req.params.id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

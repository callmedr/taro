import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUCKET_NAME } from '../constants';

// NOTE: This assumes `@supabase/supabase-js` is available in the environment.
// If not, it should be loaded via CDN in index.html and this code adjusted.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getCardImageUrl(cardId: number, cardName: string): string {
    // Convert card name to a filename, handling any extra whitespace robustly.
    // e.g., "The  High Priestess" -> "The_High_Priestess.png"
    const fileName = `${cardName.trim().replace(/\s+/g, '_')}.png`;
    const imagePath = `cards/${fileName}`;
    
    const { data } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(imagePath);

    if (!data.publicUrl) {
        console.error(`Could not get public URL for path: ${imagePath}. Please ensure a file with this name exists in the 'cards' folder of your Supabase bucket.`);
        // Return a placeholder or handle the error as appropriate
        return `https://picsum.photos/400/600?random=${cardId}`;
    }

    return data.publicUrl;
}
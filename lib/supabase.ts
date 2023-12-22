/* THIS IS NOT A SERVER ACTION, SUPABASE_API_KEY IS SAFE FOR BROWSER USE. */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '');

async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from('songs')
    .upload(`${Math.random()}`, file);
  if (error) {
    console.log("Upload failed :)")
  } else {
    console.log('File Uploaded Successfully.', data)
  }
}

export { uploadFile };

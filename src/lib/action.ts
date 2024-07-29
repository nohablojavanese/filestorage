import { createClient } from '@/lib/supabase/client';

export async function uploadFile(file: File, folder: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.storage
      .from('Public')
      .upload(`${folder}/${file.name}`, file);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProfileSchema, ProfileFormData } from '../schemas/profile';
import { User } from '@supabase/supabase-js';

export const useProfile = (user: User | null) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileFormData>({
    fullname: null,
    username: null,
    website: null,
    avatar_url: null,
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && error.code !== '406') throw error;

      if (data) {
        const validatedData = ProfileSchema.parse({
          fullname: data.full_name,
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
        setProfile(validatedData);
      }
    } catch (error) {
      console.error('Error loading user data!', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const updateProfile = async (newProfile: ProfileFormData) => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: newProfile.fullname,
        username: newProfile.username,
        website: newProfile.website,
        avatar_url: newProfile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      setProfile(newProfile);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating the data!', error);
      return { success: false, message: 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, getProfile, updateProfile };
};
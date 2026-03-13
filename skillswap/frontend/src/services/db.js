import { supabase } from '../lib/supabaseClient';

export const db = {
  async getProfile(userId) {
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: userId, credits: 10 })
        .select()
        .single();
      
      if (createError) throw createError;
      return newProfile;
    }
    
    if (error) throw error;
    return data;
  },

  async ensureProfile(userId, email) {
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: userId, email, credits: 10 })
        .select()
        .single();
      
      if (createError) throw createError;
      return newProfile;
    }
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getCourses(categoryId = null) {
    let query = supabase
      .from('courses')
      .select(`
        *,
        categories(name, icon, color),
        profiles!courses_tutor_id_fkey(full_name, avatar_url)
      `)
      .eq('is_published', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCourseById(courseId) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        categories(name, icon, color),
        profiles!courses_tutor_id_fkey(id, full_name, avatar_url, email)
      `)
      .eq('id', courseId)
      .single();
    if (error) throw error;
    return data;
  },

  async getLectures(courseId) {
    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
    if (error) throw error;
    return data;
  },

  async getUserEnrollments(userId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses(*, categories(name, icon, color))
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async enrollInCourse(userId, courseId, creditsSpent) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile || profile.credits < creditsSpent) {
      throw new Error('Insufficient credits');
    }

    const { data: enrollment, error: enrollError } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        credits_spent: creditsSpent
      })
      .select()
      .single();

    if (enrollError) throw enrollError;

    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditsSpent })
      .eq('id', userId);

    if (deductError) throw deductError;

    return enrollment;
  },

  async getLectureProgress(userId, lectureIds) {
    if (!lectureIds.length) return [];
    const { data, error } = await supabase
      .from('lecture_progress')
      .select('*')
      .eq('user_id', userId)
      .in('lecture_id', lectureIds);
    if (error) throw error;
    return data;
  },

  async updateLectureProgress(userId, lectureId, watchedSeconds, isCompleted = false) {
    const { data, error } = await supabase
      .from('lecture_progress')
      .upsert({
        user_id: userId,
        lecture_id: lectureId,
        watched_seconds: watchedSeconds,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      }, { onConflict: 'user_id,lecture_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async completeCourse(userId, courseId) {
    const { error } = await supabase
      .from('enrollments')
      .update({
        is_completed: true,
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('course_id', courseId);
    if (error) throw error;
  },

  async createCreditPurchase(userId, credits, amount) {
    const { data, error } = await supabase
      .from('credit_purchases')
      .insert({
        user_id: userId,
        credits,
        amount_paid: amount,
        status: 'pending'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePurchaseStatus(purchaseId, razorpayOrderId, status) {
    const { data, error } = await supabase
      .from('credit_purchases')
      .update({ razorpay_order_id: razorpayOrderId, status })
      .eq('id', purchaseId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addCreditsToUser(userId, credits) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    const newCredits = (profile?.credits || 0) + credits;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTeacherSkills(userId) {
    const { data, error } = await supabase
      .from('teacher_skills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addTeacherSkill(userId, skillName, description, yearsExperience) {
    const { data, error } = await supabase
      .from('teacher_skills')
      .insert({
        user_id: userId,
        skill_name: skillName,
        description,
        years_experience: yearsExperience
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async searchCourses(searchTerm, category = null) {
    let query = supabase
      .from('courses')
      .select(`
        *,
        categories(name, icon, color),
        profiles!courses_tutor_id_fkey(full_name, avatar_url)
      `)
      .eq('is_published', true);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    if (category && category !== 'All') {
      query = query.eq('categories.name', category);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return data;
  }
};

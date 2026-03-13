-- Fix RLS Policies for SkillSwap
-- Run this in Supabase SQL Editor to fix the security policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Allow authenticated users to read their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Allow public read access to categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "categories_public_read" ON categories
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow public read access to published courses
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
CREATE POLICY "courses_public_read" ON courses
    FOR SELECT
    TO authenticated
    USING (is_published = true);

-- Allow authenticated users to view their own enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
CREATE POLICY "enrollments_select_own" ON enrollments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to create enrollments
DROP POLICY IF EXISTS "Users can create enrollments" ON enrollments;
CREATE POLICY "enrollments_insert_own" ON enrollments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own enrollments
DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
CREATE POLICY "enrollments_update_own" ON enrollments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to manage own lecture progress
DROP POLICY IF EXISTS "Users can manage own progress" ON lecture_progress;
CREATE POLICY "lecture_progress_all_own" ON lecture_progress
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view own purchases
DROP POLICY IF EXISTS "Users can view own purchases" ON credit_purchases;
CREATE POLICY "credit_purchases_select_own" ON credit_purchases
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to create purchases
DROP POLICY IF EXISTS "Users can create purchases" ON credit_purchases;
CREATE POLICY "credit_purchases_insert_own" ON credit_purchases
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update own purchases
DROP POLICY IF EXISTS "Users can update own purchases" ON credit_purchases;
CREATE POLICY "credit_purchases_update_own" ON credit_purchases
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow anyone to view approved teacher skills
DROP POLICY IF EXISTS "Anyone can view approved skills" ON teacher_skills;
CREATE POLICY "teacher_skills_public_read" ON teacher_skills
    FOR SELECT
    TO authenticated
    USING (is_approved = true);

-- Allow authenticated users to manage own skills
DROP POLICY IF EXISTS "Users can manage own skills" ON teacher_skills;
CREATE POLICY "teacher_skills_all_own" ON teacher_skills
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow public read access to lectures
DROP POLICY IF EXISTS "lectures_public_read" ON lectures;
CREATE POLICY "lectures_public_read" ON lectures
    FOR SELECT
    TO authenticated
    USING (true);

-- Verify policies are created
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

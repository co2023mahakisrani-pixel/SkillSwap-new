-- SkillSwap Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    credits INTEGER DEFAULT 10,
    is_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    full_description TEXT,
    category_id UUID REFERENCES categories(id),
    tutor_id UUID REFERENCES profiles(id),
    credits INTEGER NOT NULL DEFAULT 5,
    duration TEXT,
    thumbnail_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lectures table (video content)
CREATE TABLE lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    duration TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    credits_spent INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Lecture progress table
CREATE TABLE lecture_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    watched_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lecture_id)
);

-- Credit purchases table
CREATE TABLE credit_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher skills table
CREATE TABLE teacher_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    description TEXT,
    years_experience INTEGER,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_skills ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Course policies
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Teachers can insert courses" ON courses FOR INSERT WITH CHECK (auth.uid() = tutor_id);
CREATE POLICY "Teachers can update own courses" ON courses FOR UPDATE USING (auth.uid() = tutor_id);

-- Enrollment policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lecture progress policies
CREATE POLICY "Users can manage own progress" ON lecture_progress FOR ALL USING (auth.uid() = user_id);

-- Credit purchases policies
CREATE POLICY "Users can view own purchases" ON credit_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create purchases" ON credit_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teacher skills policies
CREATE POLICY "Anyone can view approved skills" ON teacher_skills FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can manage own skills" ON teacher_skills FOR ALL USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, credits)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        10
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO categories (name, icon, color) VALUES
    ('Programming', 'Code', 'bg-blue-500'),
    ('UI/UX', 'Palette', 'bg-pink-500'),
    ('Web Development', 'Globe', 'bg-green-500'),
    ('Mobile Development', 'Smartphone', 'bg-purple-500'),
    ('Data Science', 'Database', 'bg-orange-500'),
    ('DevOps', 'Cloud', 'bg-cyan-500'),
    ('Cybersecurity', 'Shield', 'bg-red-500'),
    ('AI/ML', 'Cpu', 'bg-indigo-500')
ON CONFLICT (name) DO NOTHING;

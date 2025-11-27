-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view their enrollments" ON public.user_classes;

-- Create a new policy that allows viewing all members of classes you are in
CREATE POLICY "Users can view members of their classes" ON public.user_classes
  FOR SELECT USING (
    class_id IN (
      SELECT class_id FROM public.user_classes WHERE user_id = auth.uid()
    )
  );

-- Also allow owners to see members (covered by above if owner is enrolled, which they are)
-- But to be safe, allow viewing if you are the owner of the class
CREATE POLICY "Owners can view members" ON public.user_classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE id = public.user_classes.class_id 
      AND owner_id = auth.uid()
    )
  );

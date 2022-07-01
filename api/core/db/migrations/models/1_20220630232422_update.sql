-- upgrade --
CREATE UNIQUE INDEX "uid_studentteac_student_95709c" ON "studentteachers" ("student_id", "teacher_id", "subject_id");
-- downgrade --
DROP INDEX "uid_studentteac_student_95709c";
